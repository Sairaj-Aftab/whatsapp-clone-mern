import { useEffect, useRef, useState } from "react";

function dropDownPopId() {
  const [open, setOpen] = useState(null);
  const dropDownRef = useRef(null);

  const toggleMenu = (id) => {
    if (!open) {
      setOpen(id);
    } else {
      setOpen(null);
    }
  };

  const handleClickOutSide = (e) => {
    // console.log(dropDownRef.current.contains(e.target));
    // console.log(dropDownRef.current);
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      setOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutSide);

    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, []);

  return { open, toggleMenu, dropDownRef };
}

export default dropDownPopId;
