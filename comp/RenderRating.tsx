import React from 'react';
import Image from 'next/image';

interface Props {
  rating: number;
}

const RenderRating = ({ rating }: Props) => {
  const roundedRating = Math.round(rating);
  const imageUrl = `/shared-assets/ratings/${roundedRating}.png`;

  return (
    // This wrapper div controls the size of the image.
    // 'position: relative' is required for layout="fill".
    <div style={{ position: 'relative', width: '100px', height: '20px' }}>
      <Image
        src={imageUrl}
        alt={`Rating: ${roundedRating} out of 5 stars`}
        layout="fill" // The image will fill the dimensions of the parent div.
        objectFit="contain" // Ensures the entire image fits within the container without distortion.
        priority // Optional: Add if the image is above-the-fold to load it faster.
      />
    </div>
  );
};

export default RenderRating;