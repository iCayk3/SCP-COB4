import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import AvatarGroup from '@mui/material/AvatarGroup';
import LinearProgress from '@mui/material/LinearProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENT
import MoreHoriz from '@mui/icons-material/MoreHoriz';
// CUSTOM COMPONENTS
import { MoreButton } from '@/components/more-button';
import { FlexBox, FlexBetween } from '@/components/flexbox';
// CUSTOM DATA
import { PROJECT_FILES, PROJECT_STACKS, PROJECT_TASKS, PROJECT_TOOLS } from '@/__fakeData__/projects';

// STYLED COMPONENTS
const StyledAvatar = styled(Avatar)({
  width: 34,
  height: 34
});
const Div = styled('div')({
  padding: '1.5rem'
});
const RightContentWrapper = styled('div')({
  gap: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '& .MuiPaper-root': {
    padding: '1.5rem'
  }
});
const StyledFormControlLabel = styled(FormControlLabel)({
  margin: 0,
  width: '100%',
  paddingBottom: '1rem',
  alignItems: 'flex-start',
  '& .MuiRadio-root': {
    padding: 0,
    paddingRight: 10
  },
  '&:last-child': {
    paddingBottom: 0
  }
});
export default function ProjectDetails() {
  return <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        <Grid size={{
        md: 8,
        xs: 12
      }}>
          <Card>
            <Div>
              <FlexBetween>
                <Typography variant="h6" sx={{
                mb: 1
              }}>
                  Project Nightfall
                </Typography>

                <MoreButton Icon={MoreHoriz} />
              </FlexBetween>

              <Typography variant="body2" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor ut labore et dolore magna aliqua.
                elit, sed do eiusmod tempor ut labore et dolore magna aliqua. sed do eiusmod tempor
                ut labore.
              </Typography>
            </Div>

            <Divider />

            <Div>
              <Grid container spacing={3}>
                {/* TASKS */}
                <Grid size={{
                sm: 7,
                xs: 12
              }}>
                  <Typography variant="body1" fontWeight={500} sx={{
                  mb: 2
                }}>
                    Tasks
                  </Typography>

                  {PROJECT_TASKS.map(task => <StyledFormControlLabel key={task.title} control={<Radio size="small" disableRipple disableTouchRipple disableFocusRipple checked={task.status === 'Completed'} />} label={<div>
                          <Typography variant="body2" lineHeight={1} fontWeight={500}>
                            {task.title}
                          </Typography>

                          <Typography variant="body2" mt={0.5} fontSize={12} color="text.secondary">
                            {task.status}
                          </Typography>
                        </div>} />)}
                </Grid>

                {/* TEAMS */}
                <Grid size={{
                sm: 5,
                xs: 12
              }}>
                  <Typography variant="body1" fontWeight={500} sx={{
                  mb: 2
                }}>
                    Team
                  </Typography>

                  <AvatarGroup max={5}>
                    <Avatar alt="Remy Sharp" src="/static/user/user-16.png" />
                    <Avatar alt="Travis Howard" src="/static/user/user-17.png" />
                    <Avatar alt="Cindy Baker" src="/static/user/user-18.png" />
                    <Avatar alt="Cindy Baker" src="/static/user/user-19.png" />
                    <Avatar alt="Cindy Baker" src="/static/user/user-19.png" />
                    <Avatar alt="Cindy Baker" src="/static/user/user-19.png" />
                    <Avatar alt="Cindy Baker" src="/static/user/user-19.png" />
                  </AvatarGroup>

                  <FlexBetween mb={1.5} mt={3}>
                    <Typography variant="body2" fontWeight={500}>
                      Project Progress
                    </Typography>

                    <Typography variant="body2" fontWeight={500}>
                      32%
                    </Typography>
                  </FlexBetween>

                  <LinearProgress variant="determinate" value={32} />
                </Grid>
              </Grid>
            </Div>

            <Divider />

            {/* FILE ATTACHMENTS */}
            <Div>
              <Typography variant="body1" fontWeight={500} sx={{
              mb: 2
            }}>
                File Attachment
              </Typography>

              <Grid container spacing={3}>
                {PROJECT_FILES.map(item => <Grid size={{
                sm: 6,
                xs: 12
              }} key={item.id}>
                    <FlexBetween>
                      <FlexBox alignItems="center" gap={1}>
                        <Avatar variant="square" alt="File Type" src={item.image} />

                        <div>
                          <Typography variant="body2" fontWeight={500}>
                            {item.title}
                          </Typography>

                          <FlexBox alignItems="center" gap={1} mt={0.25}>
                            <Typography variant="body2" color="text.secondary" fontSize={12}>
                              3mb
                            </Typography>

                            <Box width={4} height={4} borderRadius={1} bgcolor="text.secondary" />

                            <Typography variant="body2" color="text.secondary" fontSize={12}>
                              5 days ago
                            </Typography>
                          </FlexBox>
                        </div>
                      </FlexBox>

                      <MoreButton Icon={MoreHoriz} />
                    </FlexBetween>
                  </Grid>)}
              </Grid>
            </Div>
          </Card>
        </Grid>

        <Grid size={{
        md: 4,
        xs: 12
      }}>
          <RightContentWrapper>
            {/* PROJECT TOOLS */}
            <Card>
              <Typography variant="body1" fontWeight={600}>
                Project Tools
              </Typography>

              {PROJECT_TOOLS.map(item => <FlexBox alignItems="center" gap={1.5} mt={2} key={item.id}>
                  <StyledAvatar alt="Logo" src={item.image} />

                  <div>
                    <Typography variant="body2" fontWeight={500} lineHeight={1.6}>
                      {item.company}
                    </Typography>

                    <Typography variant="body2" fontSize={12} color="text.secondary">
                      {item.position}
                    </Typography>
                  </div>
                </FlexBox>)}
            </Card>

            {/* PROJECT STACKS */}
            <Card>
              <Typography variant="body1" fontWeight={600}>
                Project Stack
              </Typography>

              {PROJECT_STACKS.map(item => <FlexBox alignItems="center" gap={1.5} mt={2} key={item.id}>
                  <StyledAvatar alt="Logo" src={item.image} />

                  <div>
                    <Typography variant="body2" fontWeight={500} lineHeight={1.6}>
                      {item.company}
                    </Typography>

                    <Typography variant="body2" fontSize={12} color="text.secondary">
                      {item.position}
                    </Typography>
                  </div>
                </FlexBox>)}
            </Card>
          </RightContentWrapper>
        </Grid>
      </Grid>
    </div>;
}