/** Light bento cell — inverts to dark ink on hover */
export const bentoCellHover =
  "transition-colors hover:bg-bento-ink hover:text-bento-bg";

/** For cells whose children should inherit the hover text color */
export const bentoCellGroup = `group bg-bento-bg ${bentoCellHover}`;

/** Dark bento cell — inverts to light on hover */
export const bentoCellInvertedHover =
  "transition-colors hover:bg-bento-bg hover:text-bento-ink";
