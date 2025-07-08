import IntroModal from "../layout/IntroModal";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ExploreModal = ({ isOpen, setIsOpen }: Props) => {
  return <IntroModal isOpen={isOpen} setIsOpen={setIsOpen} />;
};

export default ExploreModal;
