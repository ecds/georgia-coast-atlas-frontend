import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { dataHosts } from "~/config";
import { elasticSearchHeaders } from "~/data/coredata";
import { Link } from "@remix-run/react";
import type { AnchorProps } from "node_modules/@headlessui/react/dist/internal/floating";
import type { TESHit, TTopicTree } from "~/types";

interface Props {
  anchor: AnchorProps;
  itemsClassName: string;
  linkClassName: string;
}

const TopicTree = ({ anchor, itemsClassName, linkClassName }: Props) => {
  const [tree, setTree] = useState<TTopicTree[]>();
  const treeRef = useRef<TTopicTree[]>();

  useEffect(() => {
    const fetchTree = async () => {
      const response = await fetch(
        `${dataHosts.elasticSearch}/georgia_coast_topic_tree/_search`,
        {
          method: "POST",
          body: JSON.stringify({}),
          headers: elasticSearchHeaders(),
        }
      );

      const data = await response.json();
      const result = data.hits.hits.map((hit: TESHit) => hit._source)[0];
      treeRef.current = result.doc;
      setTree(result.doc);
    };
    if (treeRef.current) return;
    fetchTree();

    return () => {
      // treeRef.current = undefined;
    };
  }, []);

  if (tree) {
    return (
      <Popover>
        {({ close }) => (
          <>
            <PopoverButton>Topics</PopoverButton>
            <PopoverPanel anchor={anchor} className={itemsClassName} transition>
              {tree.map((level1) => {
                return (
                  <Popover key={level1.slug}>
                    <PopoverButton className={linkClassName}>
                      {level1.label}
                    </PopoverButton>
                    <PopoverPanel
                      as="ul"
                      anchor="left start"
                      className={`${itemsClassName} me-4`}
                    >
                      {level1.sub_topics.map((level2) => {
                        return (
                          <Popover key={level2.slug}>
                            <PopoverButton className={linkClassName}>
                              {level2.label}
                            </PopoverButton>
                            <PopoverPanel
                              as="ul"
                              anchor="left start"
                              className={`${itemsClassName} me-4`}
                            >
                              {level2.sub_topics.map((topic) => {
                                return (
                                  <Link
                                    key={topic.slug}
                                    className={linkClassName}
                                    to={`/topics/${topic.slug}`}
                                    onClick={close}
                                  >
                                    {topic.label}
                                  </Link>
                                );
                              })}
                            </PopoverPanel>
                          </Popover>
                        );
                      })}
                    </PopoverPanel>
                  </Popover>
                );
              })}
            </PopoverPanel>
          </>
        )}
      </Popover>
    );
  }
  return <></>;
};

export default TopicTree;
