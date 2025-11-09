import { useEffect, useRef, useState } from "react";

const TOOLTIP_WIDTH = 320;
const VIEWPORT_PADDING = 8;

const useToolTipPosition = (hoveredItem, data) => {
  const cardRefs = useRef([]);
  const [tooltipStyle, setTooltipStyle] = useState({
    top: 0,
    left: 0,
    transform: "translateY(-50%)",
    position: "fixed",
    zIndex: 100000,
    pointerEvents: "auto",
  });

  const updateToolTipPosition = () => {
    if (hoveredItem !== null) {
      const refIndex = data.findIndex(
        (item, index) => item.id + index === hoveredItem
      );
      const ref = cardRefs.current[refIndex];
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const gap = 12;

        let left;
        const spaceRight = window.innerWidth - rect.right;
        if (spaceRight >= TOOLTIP_WIDTH + gap + VIEWPORT_PADDING) {
          left = rect.right + gap;
        } else if (rect.left >= TOOLTIP_WIDTH + gap + VIEWPORT_PADDING) {
          left = rect.left - TOOLTIP_WIDTH - gap;
        } else {
          left = Math.max(
            VIEWPORT_PADDING,
            Math.min(
              window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_PADDING,
              rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2
            )
          );
        }

        setTooltipStyle({
          position: "fixed",
          top: centerY,
          left,
          transform: "translateY(-50%)",
          zIndex: 100000,
          pointerEvents: "auto",
        });
      }
    }
  };

  useEffect(() => {
    updateToolTipPosition();
    const handleScroll = () => updateToolTipPosition();
    const handleResize = () => updateToolTipPosition();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [hoveredItem, data]);

  return { tooltipStyle, cardRefs };
};

export default useToolTipPosition;
