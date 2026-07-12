import os
import sys
import subprocess

# Ensure Pillow is installed
try:
    from PIL import Image
except ImportError:
    print("Installing Pillow library for image processing...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def compress_images():
    images_dir = "./public/images"
    if not os.path.exists(images_dir):
        print(f"Directory {images_dir} not found.")
        return

    print("Starting image optimization...")
    files = os.listdir(images_dir)
    
    # Target widths for optimization
    # Profile photo can be small (400px), screenshots can be medium (800px)
    for filename in files:
        filepath = os.path.join(images_dir, filename)
        if not os.path.isfile(filepath):
            continue
            
        name, ext = os.path.splitext(filename)
        if ext.lower() not in ['.png', '.jpg', '.jpeg']:
            continue

        print(f"\nProcessing {filename} ({os.path.getsize(filepath) // 1024} KB)...")
        
        try:
            with Image.open(filepath) as img:
                # Determine display width
                if "profile" in name.lower():
                    target_width = 400
                else:
                    target_width = 800
                
                # Resize if larger than target
                width, height = img.size
                if width > target_width:
                    aspect_ratio = height / width
                    new_height = int(target_width * aspect_ratio)
                    img = img.resize((target_width, new_height), Image.Resampling.LANCZOS)
                    print(f"Resized from {width}x{height} to {target_width}x{new_height}")

                # Save as WebP with 75% quality compression
                webp_filename = f"{name}.webp"
                webp_filepath = os.path.join(images_dir, webp_filename)
                
                img.save(webp_filepath, "WEBP", quality=75)
                new_size = os.path.getsize(webp_filepath) // 1024
                print(f"Saved as {webp_filename} ({new_size} KB)")
                
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    print("\nOptimization completed successfully!")

if __name__ == "__main__":
    compress_images()
