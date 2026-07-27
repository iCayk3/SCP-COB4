import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import Feature from './Feature';
import FollowMore from './FollowMore';
const CONTENT_STYLES = {
  mt: 2,
  lineHeight: 1.7,
  textAlign: 'justify',
  color: 'text.secondary'
};
export default function AboutUs2PageView() {
  return <Box py={3} maxWidth={930} margin="auto">
      <Card>
        <img src="/static/thumbnail/thumbnail-7.png" width="100%" alt="about" />

        <div className="p-3">
          <Typography variant="h5" fontSize={20}>
            About Us
          </Typography>

          <Typography variant="body2" sx={CONTENT_STYLES}>
            To other made was hunt, their not at them. How the that they task. Options they to
            hours. And the should company, in into being herself get approached country. We same
            bread so slid duty think chair. Had leather oh, client which phase uneasiness, way.
            Shared agency, kind he tone name was had how the name can one man he is and text doctor
            ridden spree. Farther, a not noise self-discipline. In is on both I and hazardous for
            the text devotion phase in much eminent his with state that we could there text
            presented. Changes acquired made, the feel.
          </Typography>

          <Typography variant="body2" sx={{
          ...CONTENT_STYLES,
          mb: 6
        }}>
            All economics city, a she day into and concept. Seemed I profiles with him as rolled
            called align than the up acknowledge a because and tag bold, if there pay both you
            original second of target. It eminent so more been best hope a of behind and the and
            attempt. That fur place. Into I bed. A couldn't it and secretly keep compensation
            necessary any wait must and yes, clothes, you'd it lay troubled magnitude, work for very
            act and of just conduct, partiality more behind gentlemen, an get few where were phase
            parts could the other and thought.
          </Typography>

          {/* FEATURE CARDS SECTION */}
          <Feature />

          {/* FOLLOW MORE FOOTER SECTION */}
          <FollowMore />
        </div>
      </Card>
    </Box>;
}