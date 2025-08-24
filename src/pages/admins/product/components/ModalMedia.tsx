import { Modal } from "antd";
import {
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

const ModalMedia = ({
  children,
  media,
}: {
  children: ReactNode;
  media: { thumbnail: string; images: string[] };
}) => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const hiddenModal = () => {
    setOpen(false);
  };

  return (
    <>
      {isValidElement(children)
        ? cloneElement(children as ReactElement<any>, {
            onClick: () => {
              if (typeof (children as any).props?.onClick === "function") {
                (children as any).props.onClick();
              }
              showModal();
            },
          })
        : children}
      <Modal open={open} onCancel={hiddenModal} footer={<></>}>
        <h3 className="font-semibold text-lg">Ảnh bìa sản phẩm</h3>
        <img className="w-32 mt-4" src={media.thumbnail} />
        <h3 className="font-semibold text-lg mt-4">Thư viện ảnh</h3>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          {media.images.map((item) => (
            <img className="w-32" src={item} />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ModalMedia;
