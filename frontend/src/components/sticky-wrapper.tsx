import React, { useEffect, useRef, useState } from "react";

// Props definition
interface Props {
  className: string;
}

export const StickyWrapper: React.FC<Props> = (props: React.PropsWithChildren<Props>) => {
  const { className, children } = props;

  const [isSticky, setIsSticky] = useState<boolean>(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScroll = () => {
      const top = root.current?.offsetTop;
      const newIsSticky = typeof top === "number" && top !== 0;
      setIsSticky((sticky) => {
        if (newIsSticky !== sticky) return newIsSticky;
        return sticky;
      });
    };
    window.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  return (
    <div className={`${className}${isSticky ? " sticky" : ""}`} ref={root}>
      {children}
    </div>
  );
};
