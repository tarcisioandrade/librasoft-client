import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import React, { ComponentProps } from "react";

type Props = {
  rating: number;
  hiddenRatingNumber?: boolean;
  totalStars?: number;
  size?: number;
} & ComponentProps<"span">;

const StarRating = ({
  rating,
  totalStars = 5,
  size,
  hiddenRatingNumber = false,
  className,
  ...props
}: Props) => {
  const stars = [];

  for (let i = 0; i < totalStars; i++) {
    if (i < rating) {
      stars.push(<Star size={size} fill="#fb5" color="#fb5" key={i} />);
    } else {
      stars.push(<Star size={size} color="#fb5" key={i} />);
    }
  }

  return (
    <span
      className={cn(!hiddenRatingNumber && "flex items-center gap-1", className)}
      style={{ fontSize: size ? size : 16 }}
      {...props}
    >
      {hiddenRatingNumber ? null : rating.toFixed(1)}{" "}
      <div className="flex items-center">{stars}</div>
    </span>
  );
};

export default StarRating;
