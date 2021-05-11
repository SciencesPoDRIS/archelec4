import React, { useEffect, useRef, useState } from "react";

import { Header } from "./header";
import { Footer } from "./footer";
import { PlainObject } from "../types";

export const Layout: React.FC<{}> = ({ children }) => {
  const main = useRef<HTMLElement>(null);
  const [isNotOnTop, setIsNotOnTop] = useState<boolean>(false);
  const [isNearBottom, setIsNearBottom] = useState<boolean>(false);
  /**
   * This function checks if the page is scrolled to the bottom (or near the
   * bottom), and, if there is no data loading and there are more results to
   * fetch, it will load the next N results.
   */

  function checkScroll() {
    if (main && main.current) {
      setIsNearBottom(main.current.scrollTop >= main.current.scrollHeight - main.current.offsetHeight - 500);
      setIsNotOnTop(main.current.scrollTop > main.current.offsetHeight);
    }
  }
  // Check scroll on window scroll:
  useEffect(() => {
    let mainClojure = main.current;
    if (main && main.current) {
      main.current.addEventListener("scroll", checkScroll);
    }
    return function cleanup() {
      if (mainClojure) mainClojure.removeEventListener("scroll", checkScroll);
    };
  }, [main]);
  const scrollTo = (p: PlainObject) => {
    if (main && main.current) main.current.scrollTo(p);
  };

  return (
    <>
      <Header />
      <main ref={main}>
        {children &&
          React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                isNearBottom,
                isNotOnTop,
                scrollTo,
              });
            }
          })}
      </main>
      <Footer />
    </>
  );
};
