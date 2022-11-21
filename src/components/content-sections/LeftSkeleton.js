import React from "react";
import classnames from "classnames";
import styles from "./Sections.module.css";
import Skeleton from "react-loading-skeleton";

export const LeftSkeleton = () => {
    return (
        <div className={classnames(styles.leftSection)}>
            <div>
                <h2>
                    <Skeleton width={140} />
                </h2>
                <p>
                    <Skeleton count={4} />{" "}
                </p>
                <h2>
                    <Skeleton width={160} />
                </h2>
                <p>
                    <Skeleton count={6} />{" "}
                </p>
                <h2>
                    <Skeleton width={160} />
                </h2>
                <p>
                    <Skeleton count={4} />{" "}
                </p>
            </div>
        </div>
    );
};
