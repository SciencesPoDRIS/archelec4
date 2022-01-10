import { FC, useEffect, useState, RefObject } from "react";
import cx from "classnames";

import { config } from "../../config";
import { search } from "../../elasticsearchClient";
import { PlainObject, ProfessionDeFoi, ESSearchQueryContext } from "../../types";
import { ProfessionList } from "../../components/profession-list";
import { Loader } from "../../components/loader";

interface ResultListProps {
  containerRef: RefObject<HTMLDivElement>;
  context: ESSearchQueryContext;
  result: {
    data: Array<ProfessionDeFoi>;
    total: number;
  };
}
export const ResultList: FC<ResultListProps> = ({ containerRef, context, result }) => {
  // scroll

  const [isNotOnTop, setIsNotOnTop] = useState<boolean>(false);
  const [isNearBottom, setIsNearBottom] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<Array<ProfessionDeFoi>>([]);

  useEffect(() => {
    setList(result.data);
  }, [result]);

  // Check scroll on window scroll:
  useEffect(() => {
    /**
     * This function checks if the page is scrolled to the bottom (or near the
     * bottom), and, if there is no data loading and there are more results to
     * fetch, it will load the next N results.
     */
    const container = containerRef.current;
    function checkScroll() {
      if (container && !loading) {
        setIsNearBottom(container.scrollTop >= container.scrollHeight - container.offsetHeight - 500);
        setIsNotOnTop(container.scrollTop > container.offsetHeight);
      }
    }
    if (container) container.addEventListener("scroll", checkScroll);
    return () => {
      if (container) container.removeEventListener("scroll", checkScroll);
    };
  }, [containerRef, loading]);

  const scrollTo = (p: PlainObject) => {
    if (containerRef && containerRef.current) containerRef.current.scrollTo(p);
  };

  /**
   * This function checks if the page is scrolled to the bottom (or near the
   * bottom), and, if there is no data loading and there are more results to
   * fetch, it will load the next N results.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isNearBottom && !loading && result && result.data.length < result.total) {
      setLoading(true);
      search<ProfessionDeFoi>(
        context,
        (result: PlainObject): ProfessionDeFoi => result as ProfessionDeFoi,
        list.length,
        config.pagination_size,
      ).then((newResults) => {
        setLoading(false);
        setIsNearBottom(false);
        setList(list.concat(newResults.data));
      });
    }
  }, [isNearBottom, loading, list, result, context, context.sort]);

  return (
    <div>
      <ProfessionList list={list || []} />
      {loading && <Loader className="m-3 text-center" />}
      <div
        className={cx("scroll-to-top", isNotOnTop && "show")}
        onClick={() => {
          if (scrollTo) scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <i className="fas fa-arrow-up" />
        <br />
        Retour en haut
      </div>
    </div>
  );
};
