for file in *.jpg *.jpeg *.png; do
    avifenc "$file" "${file%.*}.avif"
done
