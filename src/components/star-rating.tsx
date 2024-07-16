import { Star } from "lucide-react";
import React from "react";

type Props = {
  totalStars?: number;
  rating: number;
  size?: number;
};

const StarRating = ({ rating, totalStars = 5, size }: Props) => {
  const stars = [];

  for (let i = 0; i < totalStars; i++) {
    if (i < rating) {
      stars.push(<Star size={size} fill="gold" color="gold" key={i} />);
    } else {
      stars.push(<Star size={size} color="gold" key={i} />);
    }
  }

  return <div className="flex items-center">{stars}</div>;
};

export default StarRating;
