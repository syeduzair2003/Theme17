import React from "react";
import Image from "next/image";

interface Props {
  rating: number;
}

const RenderRating = ({ rating }: Props) => {
  const roundedRating = Math.round(rating);
  const imageUrl = `/shared-assets/ratings/${roundedRating}.png`;

  return (
    <div style={{ position: "relative", width: "100px", height: "20px" }}>
      <Image
        src={imageUrl}
        alt={`Rating: ${roundedRating} out of 5 stars`}
        layout="fill"
        objectFit="contain"
        priority
      />
    </div>
  );
};

export default RenderRating;
