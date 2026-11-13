#!/usr/bin/env python3
"""Copy the handed-over photo folders into public/photography/ as web-sized webp.

    python3 -I scripts/import-photography.py <影像 folder> [public/photography]

Source layout (how the folders arrived):
    影像/人像/<中文组名>/*.jpg        one folder per shoot
    影像/风光/*.jpg + 风光/胶片/*.JPG  one continuous run, film frames in a subfolder

Destination layout (what scripts/build-photography.mjs reads):
    public/photography/portrait/<NN-slug>/01.webp …
    public/photography/landscape/NN.webp, film frames keep a -film suffix

Originals stay untouched; EXIF (including GPS) is dropped on the way out.
"""

import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

# Order is the reading order of the folio: the longer sets open, the single
# frame closes. Slugs become part of the public URL, so they stay ASCII.
PORTRAIT_SETS = [
    ('01-daylight', '日系人像'),
    ('02-sakura', '樱花人像'),
    ('03-rain', '雨天情绪人像'),
    ('04-letter', '情书人像'),
    ('05-campus', '校园男生人像'),
    ('06-mood', '情绪人像'),
    ('07-erhai', '洱海人像'),
    ('08-aquarium', '海洋馆人像'),
    ('09-night', '夜晚人像'),
    ('10-rapeseed', '油菜花人像'),
    ('11-grassland', '草原人像'),
    ('12-pair', '双人'),
    ('13-snowline', '雪山下人像'),
]

EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.heic'}
PORTRAIT_EDGE = 1600
LANDSCAPE_EDGE = 2000
QUALITY = 82


def sorted_images(folder: Path) -> list[Path]:
    chunk = lambda text: [int(part) if part.isdigit() else part.lower() for part in re.split(r'(\d+)', text)]
    files = [item for item in folder.iterdir() if item.is_file() and item.suffix.lower() in EXTENSIONS]
    return sorted(files, key=lambda item: chunk(item.name))


def convert(source: Path, target: Path, edge: int) -> tuple[int, int]:
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert('RGB')
        image.thumbnail((edge, edge), Image.LANCZOS)
        target.parent.mkdir(parents=True, exist_ok=True)
        image.save(target, 'WEBP', quality=QUALITY, method=6)
        return image.size


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    source = Path(sys.argv[1]).expanduser()
    dest = Path(sys.argv[2]).expanduser() if len(sys.argv) > 2 else Path.cwd() / 'public/photography'
    if not source.is_dir():
        print(f'no such folder: {source}')
        return 1

    total = 0
    for slug, folder in PORTRAIT_SETS:
        images = sorted_images(source / '人像' / folder)
        if not images:
            print(f'  {slug} ({folder}) — empty, skipped')
            continue
        for index, image in enumerate(images, 1):
            width, height = convert(image, dest / 'portrait' / slug / f'{index:02d}.webp', PORTRAIT_EDGE)
        print(f'  {slug} ({folder}) — {len(images)} photos, last {width}x{height}')
        total += len(images)

    run = [(item, '') for item in sorted_images(source / '风光')]
    film = source / '风光' / '胶片'
    if film.is_dir():
        run += [(item, '-film') for item in sorted_images(film)]
    for index, (image, suffix) in enumerate(run, 1):
        convert(image, dest / 'landscape' / f'{index:02d}{suffix}.webp', LANDSCAPE_EDGE)
    print(f'portrait: {total} photos in {len(PORTRAIT_SETS)} sets')
    print(f'landscape: {len(run)} photos ({sum(1 for _, suffix in run if suffix)} film)')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
