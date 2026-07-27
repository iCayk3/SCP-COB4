import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import ExpandMore from '@mui/icons-material/ExpandMore';
// CUSTOM COMPONENT
import { SectionTitle } from '@/components/section-title';
// STYLED COMPONENTS
import { StyledAccordionDetails, StyledAccordionSummary } from './styles';
export default function Section2() {
  return <Container maxWidth="lg" className="py-10">
      <SectionTitle centered title="Frequently asked questions" />

      <Stack maxWidth={700} margin="auto" mt={7}>
        {faqItems.map(item => <Accordion key={item.id} defaultExpanded={item.defaultExpanded}>
            <StyledAccordionSummary expandIcon={<ExpandMore />}>
              {item.question}
            </StyledAccordionSummary>

            <StyledAccordionDetails>{item.answer}</StyledAccordionDetails>
          </Accordion>)}
      </Stack>
    </Container>;
}
const faqItems = [{
  id: 'faq-1',
  question: 'What is project management software?',
  answer: 'Project management software helps teams to stay organized and on track by providing a central hub for project information, task assignment, & progress tracking. It also facilitate communication & collaboration between team members, reducing the risk miscommunication.',
  defaultExpanded: false
}, {
  id: 'faq-2',
  question: 'How does project management software help teams?',
  answer: 'Project management software helps teams to stay organized and on track by providing a central hub for project information, task assignment, & progress tracking. It also facilitate communication & collaboration between team members, reducing the risk miscommunication.',
  defaultExpanded: true
}, {
  id: 'faq-3',
  question: 'What features should I look for in project management software?',
  answer: 'Project management software helps teams to stay organized and on track by providing a central hub for project information, task assignment, & progress tracking. It also facilitate communication & collaboration between team members, reducing the risk miscommunication.',
  defaultExpanded: false
}, {
  id: 'faq-4',
  question: 'Is project management software easy to use?',
  answer: 'Project management software helps teams to stay organized and on track by providing a central hub for project information, task assignment, & progress tracking. It also facilitate communication & collaboration between team members, reducing the risk miscommunication.',
  defaultExpanded: false
}, {
  id: 'faq-5',
  question: 'Can project management software be used by remote teams?',
  answer: 'Project management software helps teams to stay organized and on track by providing a central hub for project information, task assignment, & progress tracking. It also facilitate communication & collaboration between team members, reducing the risk miscommunication.',
  defaultExpanded: false
}];