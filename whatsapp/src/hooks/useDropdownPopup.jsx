import { useEffect, useRef, useState } from "react";

function useDropdownPopup() {
  const [open, setOpen] = useState(false);
  const dropDownRef = useRef(null);

  const toggleMenu = () => {
    setOpen(!open);
  };

  const handleClickOutSide = (e) => {
    // console.log(dropDownRef.current.contains(e.target));
    // console.log(dropDownRef.current);
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      setOpen(false);
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

export default useDropdownPopup;
