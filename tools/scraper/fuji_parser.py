"""
Fuji Recipe Parser - X-Trans IV Film Simulation Recipes
Scrapes recipes from fujixweekly.com and outputs clean JSON.

Source: https://fujixweekly.com/fujifilm-x-trans-iv-recipes/
Usage: python fuji_parser.py
Output: tools/scraper/fuji_recipes_xtrans4.json

For personal use only. Respect the site's terms of service.
"""

import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

INDEX_URL = "https://fujixweekly.com/fujifilm-x-trans-iv-recipes/"
OUTPUT_FILE = Path(__file__).parent / "fuji_recipes_xtrans4.json"
REQUEST_DELAY = 1.2
RETRY_DELAY = 10
USER_AGENT = "FujiRecipeHub/1.0 (personal recipe manager; not a bot)"

# Known setting keys for detection (lowercase)
KNOWN_KEYS = {
    "film simulation",
    "dynamic range",
    "highlight",
    "shadow",
    "color",
    "noise reduction",
    "high iso nr",
    "sharpening",
    "sharpness",
    "clarity",
    "grain effect",
    "grain",
    "color chrome effect",
    "color chrome effect blue",
    "color chrome fx blue",
    "white balance",
    "iso",
    "exposure compensation",
    "toning",
    "smooth skin effect",
    "grain effect size",
}

# Map from raw key (lowercase) to canonical field name
FIELD_MAP = {
    "film simulation": "film_simulation",
    "dynamic range": "dynamic_range",
    "highlight": "highlight",
    "shadow": "shadow",
    "color": "color",
    "noise reduction": "noise_reduction",
    "high iso nr": "noise_reduction",
    "sharpening": "sharpening",
    "sharpness": "sharpening",
    "clarity": "clarity",
    "grain effect": "grain_effect",
    "grain": "grain_effect",
    "color chrome effect": "color_chrome_effect",
    "color chrome effect blue": "color_chrome_effect_blue",
    "color chrome fx blue": "color_chrome_effect_blue",
    "white balance": "white_balance",
    "iso": "iso",
    "exposure compensation": "exposure_compensation",
}


def fetch_page(url: str) -> str | None:
    """Fetch a page with polite crawling and retry logic."""
    headers = {"User-Agent": USER_AGENT}
    try:
        resp = requests.get(url, headers=headers, timeout=30)
        if resp.status_code in (429, 503):
            print(f"  Rate limited ({resp.status_code}), waiting {RETRY_DELAY}s...")
            time.sleep(RETRY_DELAY)
            resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        return resp.text
    except requests.RequestException as e:
        print(f"  ERROR fetching {url}: {e}")
        return None


def extract_recipe_links(html: str) -> list[dict]:
    """Extract recipe links from the index page."""
    soup = BeautifulSoup(html, "html.parser")
    content = soup.find("div", class_="entry-content") or soup.find("article") or soup
    links = []
    seen_urls = set()

    # URLs to always skip
    skip_urls = {INDEX_URL.rstrip("/")}
    # Patterns in URLs that indicate non-recipe pages
    skip_url_patterns = ["/category/", "/tag/", "/about", "/contact",
                         "/fujifilm-x-trans-iv-recipes", "/fujifilm-x-trans-iii",
                         "/fujifilm-x-trans-v-recipes", "/fujifilm-gfx-recipes",
                         "/app", "/my-integrations"]
    # Names that indicate junk entries
    skip_name_patterns = ["share on", "fuji x weekly app", "film simulation recipes",
                          "opens in new window", "x-trans iii", "x-trans v "]

    for a_tag in content.find_all("a", href=True):
        href = a_tag["href"]
        if "fujixweekly.com" not in href:
            continue
        if href.rstrip("/") in skip_urls:
            continue
        if href in seen_urls:
            continue
        if any(skip in href.lower() for skip in skip_url_patterns):
            continue

        # Get the name from the link text or image alt
        name = a_tag.get_text(strip=True)
        if not name:
            img = a_tag.find("img")
            if img:
                name = img.get("alt", "").strip()
        if not name:
            continue

        # Skip junk names
        name_lower = name.lower()
        if any(skip in name_lower for skip in skip_name_patterns):
            continue

        seen_urls.add(href)
        links.append({"name": name, "url": href})

    return links


def find_settings_block_strategy_a(soup: BeautifulSoup) -> list[str] | None:
    """Strategy A: Find first <strong> or <b> tag containing known keys."""
    content = soup.find("div", class_="entry-content") or soup.find("article") or soup

    for tag in content.find_all(["strong", "b"]):
        text = tag.get_text("\n", strip=True)
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        if len(lines) < 3:
            continue
        text_lower = text.lower()
        matches = sum(1 for key in KNOWN_KEYS if key in text_lower)
        if matches >= 1:
            return lines

    return None


def find_settings_block_strategy_b(soup: BeautifulSoup) -> list[str] | None:
    """Strategy B: Find first <p> tag where 4+ lines contain a colon."""
    content = soup.find("div", class_="entry-content") or soup.find("article") or soup

    for p_tag in content.find_all("p"):
        text = p_tag.get_text("\n", strip=True)
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        colon_count = sum(1 for line in lines if ":" in line)
        if colon_count >= 4:
            return lines

    return None


def find_settings_block_strategy_c(soup: BeautifulSoup) -> list[str] | None:
    """Strategy C: Look for settings within nested inline elements in <p> tags."""
    content = soup.find("div", class_="entry-content") or soup.find("article") or soup

    for p_tag in content.find_all("p"):
        # Get all text including from nested strong/b/em tags
        full_text = ""
        for child in p_tag.descendants:
            if hasattr(child, "name") and child.name == "br":
                full_text += "\n"
            elif isinstance(child, str):
                full_text += child

        lines = [line.strip() for line in full_text.split("\n") if line.strip()]
        if len(lines) < 3:
            continue

        text_lower = full_text.lower()
        matches = sum(1 for key in KNOWN_KEYS if key in text_lower)
        if matches >= 2:
            return lines

    return None


def find_settings_block_strategy_d(soup: BeautifulSoup) -> list[str] | None:
    """Strategy D: Collect ALL <strong>/<b> text from content and merge into one block.
    Handles pages where settings are split across multiple bold tags."""
    content = soup.find("div", class_="entry-content") or soup.find("article") or soup

    all_lines = []
    for tag in content.find_all(["strong", "b"]):
        text = tag.get_text("\n", strip=True)
        for line in text.split("\n"):
            line = line.strip()
            if line:
                all_lines.append(line)

    if len(all_lines) < 3:
        return None

    combined_lower = " ".join(all_lines).lower()
    matches = sum(1 for key in KNOWN_KEYS if key in combined_lower)
    if matches >= 3:
        return all_lines

    return None


def parse_settings_block(lines: list[str]) -> dict:
    """Parse a settings block into structured fields."""
    result = {
        "film_simulation": None,
        "dynamic_range": None,
        "highlight": None,
        "shadow": None,
        "color": None,
        "noise_reduction": None,
        "sharpening": None,
        "clarity": None,
        "grain_effect": None,
        "color_chrome_effect": None,
        "color_chrome_effect_blue": None,
        "white_balance": None,
        "iso": None,
        "exposure_compensation": None,
        "extra_settings": {},
    }

    first_line_used = False

    for i, line in enumerate(lines):
        if ":" not in line:
            # First line without colon is typically the film simulation name
            if i == 0 and not first_line_used:
                # Check it's not a label like "Film Simulation" header
                if line.lower() not in ("film simulation", "settings"):
                    result["film_simulation"] = line.strip()
                    first_line_used = True
            continue

        # Split on first colon only
        key_part, _, value_part = line.partition(":")
        key = key_part.strip()
        value = value_part.strip()

        if not value:
            continue

        key_lower = key.lower()

        # Handle "Film Simulation" as an explicit key
        if key_lower == "film simulation":
            result["film_simulation"] = value
            continue

        # Map to canonical field
        if key_lower in FIELD_MAP:
            field = FIELD_MAP[key_lower]
            result[field] = value
        else:
            # Store unknown keys in extra_settings
            result["extra_settings"][key] = value

    return result


def extract_metadata(soup: BeautifulSoup, url: str) -> dict:
    """Extract metadata (date, thumbnail) from the recipe page."""
    meta = {"published_date": None, "thumbnail_url": None}

    # Published date - try datetime attribute first, then parse text
    time_tag = soup.find("time", class_="entry-date") or soup.find("time")
    if time_tag:
        dt = time_tag.get("datetime", "")
        if dt and len(dt) >= 10:
            meta["published_date"] = dt[:10]  # ISO date part: YYYY-MM-DD
        else:
            # Fallback: parse visible text like "May 27, 2020"
            text = time_tag.get_text(strip=True)
            try:
                from datetime import datetime
                parsed = datetime.strptime(text, "%B %d, %Y")
                meta["published_date"] = parsed.strftime("%Y-%m-%d")
            except (ValueError, ImportError):
                meta["published_date"] = text

    # Thumbnail: first image in content
    content = soup.find("div", class_="entry-content") or soup.find("article") or soup
    img = content.find("img")
    if img:
        meta["thumbnail_url"] = img.get("data-lazy-src") or img.get("src", "")
        # Resolve relative URLs
        if meta["thumbnail_url"] and not meta["thumbnail_url"].startswith("http"):
            meta["thumbnail_url"] = urljoin(url, meta["thumbnail_url"])

    return meta


def detect_multiple_variants(soup: BeautifulSoup) -> list[list[str]] | None:
    """Detect if a page has multiple recipe variants with DISTINCT settings blocks.
    Only triggers when there are clearly separate recipes (not sensor-specific notes)."""
    content = soup.find("div", class_="entry-content") or soup.find("article") or soup

    # Look for headings that indicate distinct recipe variants
    headings = content.find_all(["h2", "h3", "h4"])
    variant_headings = []
    for h in headings:
        text = h.get_text(strip=True).lower()
        # Look for clear variant labels like "Version 1", "Recipe #2", etc.
        if re.search(r"(version|recipe|variant|option)\s*#?\s*\d", text):
            variant_headings.append(h)

    if len(variant_headings) < 2:
        return None

    # Try to find multiple COMPLETE settings blocks (with film simulation key)
    blocks = []
    for tag in content.find_all(["strong", "b"]):
        tag_text = tag.get_text("\n", strip=True)
        lines = [line.strip() for line in tag_text.split("\n") if line.strip()]
        if len(lines) < 5:
            continue
        text_lower = tag_text.lower()
        # Require film simulation key for a complete block
        has_film_sim = "film simulation" in text_lower or any(
            line.strip().lower() in (
                "classic chrome", "velvia", "astia", "provia", "classic neg",
                "pro neg. hi", "pro neg. std", "eterna", "acros", "monochrome",
                "classic negative", "nostalgic neg."
            ) for line in lines[:2]
        )
        matches = sum(1 for key in KNOWN_KEYS if key in text_lower)
        if has_film_sim and matches >= 3:
            blocks.append(lines)

    if len(blocks) > 1:
        return blocks
    return None


def parse_recipe_page(name: str, url: str) -> list[dict]:
    """Parse a single recipe page. Returns a list (may have multiple variants)."""
    html = fetch_page(url)
    if not html:
        return []

    soup = BeautifulSoup(html, "html.parser")
    metadata = extract_metadata(soup, url)

    # Check for multiple variants
    variant_blocks = detect_multiple_variants(soup)

    if variant_blocks and len(variant_blocks) > 1:
        recipes = []
        for idx, block in enumerate(variant_blocks, 1):
            settings = parse_settings_block(block)
            variant_name = f"{name} (v{idx})"
            recipe = {
                "name": variant_name,
                "url": url,
                "sensor": "X-Trans IV",
                **metadata,
                **settings,
            }
            recipes.append(recipe)
        return recipes

    # Single recipe - try strategies in order
    # Strategy D first: collects ALL bold text (most comprehensive for multi-block pages)
    # Then fall back to more targeted strategies
    lines = find_settings_block_strategy_d(soup)
    if not lines:
        lines = find_settings_block_strategy_a(soup)
    if not lines:
        lines = find_settings_block_strategy_c(soup)
    if not lines:
        lines = find_settings_block_strategy_b(soup)

    if not lines:
        print(f"  WARNING: No settings block found")
        return [{
            "name": name,
            "url": url,
            "sensor": "X-Trans IV",
            **metadata,
            "film_simulation": None,
            "dynamic_range": None,
            "highlight": None,
            "shadow": None,
            "color": None,
            "noise_reduction": None,
            "sharpening": None,
            "clarity": None,
            "grain_effect": None,
            "color_chrome_effect": None,
            "color_chrome_effect_blue": None,
            "white_balance": None,
            "iso": None,
            "exposure_compensation": None,
            "extra_settings": {},
        }]

    settings = parse_settings_block(lines)
    recipe = {
        "name": name,
        "url": url,
        "sensor": "X-Trans IV",
        **metadata,
        **settings,
    }
    return [recipe]


def main():
    print("=" * 60)
    print("Fuji Recipe Parser - X-Trans IV")
    print(f"Source: {INDEX_URL}")
    print("=" * 60)
    print()

    # Fetch index page
    print("Fetching index page...")
    html = fetch_page(INDEX_URL)
    if not html:
        print("FATAL: Could not fetch index page. Exiting.")
        sys.exit(1)

    # Extract recipe links
    links = extract_recipe_links(html)
    total = len(links)
    print(f"Found {total} recipe links.")
    print()

    if total == 0:
        print("No recipe links found. Check if the page structure has changed.")
        sys.exit(1)

    # Process each recipe
    all_recipes = []
    successful_parses = 0

    for idx, link in enumerate(links, 1):
        print(f"[{idx}/{total}] {link['name']}")

        try:
            recipes = parse_recipe_page(link["name"], link["url"])
            for r in recipes:
                all_recipes.append(r)
                if r.get("film_simulation"):
                    successful_parses += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            continue

        # Polite crawling delay
        if idx < total:
            time.sleep(REQUEST_DELAY)

    # Write output
    print()
    print("=" * 60)
    print(f"Writing {len(all_recipes)} recipes to {OUTPUT_FILE}")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_recipes, f, indent=2, ensure_ascii=False)

    # Stats
    print()
    print("SUMMARY")
    print(f"  Total recipes:        {len(all_recipes)}")
    print(f"  Film sim parsed:      {successful_parses}")
    print(f"  Parse failures:       {len(all_recipes) - successful_parses}")
    print(f"  Output file:          {OUTPUT_FILE}")
    print("=" * 60)


if __name__ == "__main__":
    main()
