import { useCallback, useRef, useState } from 'react';
// MUI
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
import { Counter } from '@/components/counter';
import { Carousel } from '@/components/carousel';
import { ColorRadio } from '@/components/color-radio';
// CUSTOM ICON COMPONENTS
import Heart from '@/icons/Heart';
import Twitter from '@/icons/social/Twitter';
import ChevronDown from '@/icons/ChevronDown';
import Facebook from '@/icons/social/Facebook';
import Instagram from '@/icons/social/Instagram';
// STYLED COMPONENTS
import { CarouselRoot, SlideThumb, StyledIconButton } from './styles';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';
export default function ProductViewCard() {
  const carouselRef = useRef(null);
  const [colorSelect, setColorSelect] = useState('red');
  const [selectedSlide, setSelectedSlide] = useState(0);

  // HANDLE CHANGE PRODUCT COLOR
  const handleChangeColor = useCallback(event => {
    setColorSelect(event.target.value);
  }, []);
  const handleChangeSlide = useCallback(index => {
    carouselRef.current?.slickGoTo(index);
    setSelectedSlide(index);
  }, []);
  return <Card sx={{
    padding: 2
  }}>
      <Grid container spacing={3}>
        {/* PRODUCT IMAGE CAROUSEL */}
        <Grid size={{
        md: 7,
        xs: 12
      }}>
          <CarouselRoot>
            <Carousel dots={false} slidesToShow={1} ref={carouselRef} afterChange={slideNo => setSelectedSlide(slideNo)}>
              {[0, 1, 2].map(item => <img key={item} className="slide" src="/static/products/shoe-10.png" />)}
            </Carousel>

            <StyledIconButton>
              <Heart />
            </StyledIconButton>
          </CarouselRoot>

          {/* SLIDE THUMBS */}
          <Stack justifyContent="center" direction="row" spacing={2} mt={1}>
            {[0, 1, 2].map((item, index) => <SlideThumb key={item} onClick={() => handleChangeSlide(index)} className={selectedSlide === index ? 'active' : ''}>
                <img src="/static/products/shoe-10.png" />
              </SlideThumb>)}
          </Stack>
        </Grid>

        {/* PRODUCT INFORMATION */}
        <Grid size={{
        md: 5,
        xs: 12
      }}>
          <Chip color="success" size="small" label="In Stock" />

          {/* PRODUCT CATEGORY */}
          <Typography variant="body2" sx={{
          mt: 2,
          color: 'text.secondary'
        }}>
            NIKE
          </Typography>

          {/* PRODUCT NAME */}
          <Typography variant="h5" sx={{
          mt: 2,
          fontWeight: 600
        }}>
            Air Jordan 270
          </Typography>

          {/* PRODUCT PRICE */}
          <Typography variant="h4" sx={{
          my: 2,
          fontWeight: 600,
          color: 'primary.main'
        }}>
            {currency(350)}
          </Typography>

          {/* PRODUCT COLOR */}
          <FlexBox alignItems="center" gap={3}>
            <Typography variant="body1" fontWeight={500}>
              Colors:
            </Typography>

            <RadioGroup row value={colorSelect} onChange={handleChangeColor} sx={{
            gap: 1
          }}>
              <ColorRadio value="red" icon_color="#FF316F" />
              <ColorRadio value="pumpkin" icon_color="#FE8969" />
              <ColorRadio value="purple" icon_color="#8C8DFF" />
              <ColorRadio value="green" icon_color="#27CE88" />
            </RadioGroup>
          </FlexBox>

          {/* PRODUCT SIZE */}
          <FlexBox alignItems="center" gap={3} mt={3}>
            <Typography variant="body1" fontWeight={500}>
              Select size:
            </Typography>

            <TextField select size="small" variant="outlined" slotProps={{
            select: {
              native: true,
              IconComponent: ChevronDown
            }
          }}>
              <option value="42">42</option>
              <option value="41">41</option>
              <option value="40">40</option>
            </TextField>
          </FlexBox>

          {/* PRODUCT QUANTITY */}
          <FlexBox alignItems="center" gap={3} mt={3}>
            <Typography variant="body1" fontWeight={500}>
              Quantity:
            </Typography>

            <Counter />

            <Typography variant="body2" color="text.secondary">
              Available: 12
            </Typography>
          </FlexBox>

          {/* PRODUCT ADD TO CART BUTTON */}
          <FlexBox alignItems="center" gap={3} mt={3}>
            <Button size="large" variant="contained">
              Add to cart
            </Button>

            <Button size="large" variant="contained" color="success">
              Buy Now
            </Button>
          </FlexBox>

          {/* SOCIAL LINK BUTTONS */}
          <FlexBox mt={2}>
            <IconButton>
              <Facebook sx={{
              color: 'text.secondary'
            }} />
            </IconButton>

            <IconButton>
              <Instagram sx={{
              color: 'text.secondary'
            }} />
            </IconButton>

            <IconButton>
              <Twitter sx={{
              color: 'text.secondary'
            }} />
            </IconButton>
          </FlexBox>
        </Grid>
      </Grid>
    </Card>;
}