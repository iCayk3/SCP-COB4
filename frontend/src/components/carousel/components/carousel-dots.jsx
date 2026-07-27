import { Fragment } from 'react';
import { Dot, DotList } from '../styles';
export function CarouselDots({
  dotColor,
  sx
}) {
  return {
    customPaging: () => <Dot dotColor={dotColor} />,
    appendDots: dots => <Fragment>
        <DotList sx={sx}>{dots}</DotList>
      </Fragment>
  };
}