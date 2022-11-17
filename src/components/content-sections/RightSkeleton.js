import React from "react";
import Skeleton from "react-loading-skeleton";

export const RightSkeleton = () => {
    return (
        <div>
            <Skeleton height={40} />
            <div style={{height: "8px"}} />
            <Skeleton height={40} />
            <div style={{height: "8px"}} />
            <Skeleton height={40} />
        </div>
    );
};
