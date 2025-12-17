import { createPortal } from "react-dom";

export default function ModalPortal({ children }) {
  return createPortal(children, document.body);
}
