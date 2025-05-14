import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { dataHosts } from "~/config";
import { elasticSearchHeaders } from "~/data/coredata";
import { Link } from "@remix-run/react";
import type { AnchorProps } from "node_modules/@headlessui/react/dist/internal/floating";
import type { TESHit, TTopicTree } from "~/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";

interface Props {
  anchor: AnchorProps;
  itemsClassName: string;
  linkClassName: string;
}

const TopicTree = ({ anchor, itemsClassName, linkClassName }: Props) => {
  const [popoverElement, setPopoverElement] = useState<HTMLDivElement | null>();
  const [tree, setTree] = useState<TTopicTree[] | undefined>();
  const [currentTopic, setCurrentTopic] = useState<TTopicTree | undefined>();
  const treeRef = useRef<TTopicTree[]>();
  const parentTopicRef = useRef<TTopicTree[]>();

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
      parentTopicRef.current = result.doc;
      setTree(result.doc);
    };
    if (treeRef.current) return;
    fetchTree();
  }, []);

  useEffect(() => {
    setTree(treeRef.current);
    setCurrentTopic(undefined);
  }, [popoverElement]);

  const handleClick = (topic: TTopicTree) => {
    if (topic.sub_topics) {
      parentTopicRef.current = tree;
      setCurrentTopic(topic);
      setTree(topic.sub_topics);
    }
  };

  const handelBack = () => {
    if (!treeRef.current) return;
    if (currentTopic?.parent_topics && currentTopic.parent_topics.length > 0) {
      const root = currentTopic.parent_topics.shift();
      let parentTree = treeRef.current.find((parent) => parent.slug === root);
      for (const parentTopic of currentTopic.parent_topics) {
        parentTree = parentTree?.sub_topics?.find(
          (sub) => sub.slug === parentTopic
        );
      }
      setTree(parentTree?.sub_topics);
      setCurrentTopic(parentTree);
    } else {
      setTree(treeRef.current);
      setCurrentTopic(undefined);
    }
  };

  if (tree) {
    return (
      <Popover>
        {({ close }) => (
          <>
            <PopoverButton>Topics</PopoverButton>
            <PopoverPanel
              anchor={anchor}
              className={itemsClassName}
              transition
              // @ts-expect-error: we need to use state so we can tell when the Popover closes.
              ref={setPopoverElement}
            >
              {currentTopic && (
                <button
                  onClick={handelBack}
                  className={`${linkClassName} block border-b text-md font-bold w-full text-left py-1.5 rounded-none`}
                >
                  <FontAwesomeIcon icon={faChevronLeft} /> Back
                </button>
              )}
              {tree.map((topic) => {
                if (topic.sub_topics) {
                  return (
                    <button
                      key={topic.slug}
                      className={linkClassName}
                      onClick={() => handleClick(topic)}
                    >
                      {topic.label}
                    </button>
                  );
                } else {
                  return (
                    <Link
                      key={topic.slug}
                      to={`/topics/${topic.slug}`}
                      className={linkClassName}
                      onClick={() => {
                        close();
                        setTree(treeRef.current);
                        setCurrentTopic(undefined);
                        parentTopicRef.current = undefined;
                      }}
                    >
                      {topic.label}
                    </Link>
                  );
                }
              })}
            </PopoverPanel>
          </>
        )}
      </Popover>
    );
  }
  return <div>Topics</div>;
};

export default TopicTree;
