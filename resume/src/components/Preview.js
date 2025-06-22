import { useState, useEffect, useRef } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Snackbar, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select,
  Tooltip,
  Paper,
  Chip,
  Menu,
  MenuItem as MenuItemMui
} from '@mui/material';
import { 
  PictureAsPdf as PdfIcon, 
  Share as ShareIcon, 
  Download as DownloadIcon,
  Article as ArticleIcon,
  Description as WordIcon
} from '@mui/icons-material';
import htmlDocx from 'html-docx-js/dist/html-docx';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import html2pdf from 'html2pdf.js';
import { jsPDF } from 'jspdf';
import { templates, getTemplateById } from './templates';

export default function Preview() {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const resumeRef = useRef(null);

  useEffect(() => {
    const loadResumeData = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setResumeData(docSnap.data());
        }
      } catch (error) {
        console.error('Error loading resume data:', error);
      }
      setLoading(false);
    };

    loadResumeData();
  }, [user]);

  const handleTemplateChange = (event) => {
    setSelectedTemplate(event.target.value);
  };

  const handleSharePublicly = async () => {
    try {
      const publicId = `${user.uid}-${Date.now()}`;
      const publicResumeRef = doc(db, 'public_resumes', publicId);
      
      // Structure the data in the format expected by templates
      const publicData = {
        userId: user.uid,
        templateId: selectedTemplate,
        personalInfo: {
          name: resumeData.fullname ||user.displayName,
          email: user.email,
          phone: resumeData.phone || '',
          location: resumeData.address || '',
          professionalSummary: resumeData.professionalSummary || '',
          githubUrl: resumeData.githubUrl || '',
          websiteUrl: resumeData.websiteUrl || ''
        },
        education: resumeData.education || [],
        experience: resumeData.experience || [],
        skills: resumeData.skills || [],
        certifications: resumeData.certifications || [],
        languages: resumeData.languages || [],
        achievements: resumeData.achievements || [],
        createdAt: new Date().toISOString()
      };

      // Save to Firestore
      await setDoc(publicResumeRef, publicData);

      // Create and copy the public URL
      const publicUrl = `${window.location.origin}/resume/${publicId}`;
      await navigator.clipboard.writeText(publicUrl);
      
      setSnackbarMessage('Public resume link copied to clipboard!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error sharing resume:', error);
      setSnackbarMessage('Error sharing resume. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDownloadClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDownloadHtml2PDF = () => {
    handleCloseMenu();
    const element = resumeRef.current;
    const opt = {
      margin: [10, 10],
      filename: `${user.displayName.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleDownloadJsPDF = () => {
    handleCloseMenu();
    try {
      const doc = new jsPDF({
        format: 'a4',
        unit: 'pt',
        orientation: 'portrait'
      });

      // Get the resume content
      const element = resumeRef.current;
      
      // Set font sizes and styles
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text(user.displayName, 40, 40);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      let yPos = 70;
      const lineHeight = 20;
      const margin = 40;
      const width = doc.internal.pageSize.width - (margin * 2);

      // Contact Info
      doc.text(user.email, margin, yPos);
      if (resumeData.phone) {
        doc.text(resumeData.phone, margin, yPos + lineHeight);
        yPos += lineHeight;
      }
      if (resumeData.address) {
        doc.text(resumeData.address, margin, yPos + lineHeight);
        yPos += lineHeight;
      }
      yPos += lineHeight * 1.5;

      // Professional Summary
      if (resumeData.professionalSummary) {
        doc.setFont('helvetica', 'bold');
        doc.text('Professional Summary', margin, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += lineHeight;
        
        const summaryLines = doc.splitTextToSize(resumeData.professionalSummary, width);
        doc.text(summaryLines, margin, yPos);
        yPos += (lineHeight * summaryLines.length) + lineHeight;
      }

      // Experience
      if (resumeData.experience && resumeData.experience.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('Experience', margin, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += lineHeight;

        resumeData.experience
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
          .forEach(exp => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${exp.position} at ${exp.company}`, margin, yPos);
            yPos += lineHeight;

            doc.setFont('helvetica', 'normal');
            doc.text(`${exp.startDate} - ${exp.endDate || 'Present'}`, margin, yPos);
            yPos += lineHeight;

            const descLines = doc.splitTextToSize(exp.description, width);
            doc.text(descLines, margin, yPos);
            yPos += (lineHeight * descLines.length) + lineHeight;

            // Check if we need a new page
            if (yPos > doc.internal.pageSize.height - margin) {
              doc.addPage();
              yPos = margin;
            }
          });
      }

      // Skills
      if (resumeData.skills && resumeData.skills.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('Skills', margin, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += lineHeight;

        const skillText = resumeData.skills
          .map(skill => `${skill.name} (${skill.rating}/5)`)
          .join(' • ');
        const skillLines = doc.splitTextToSize(skillText, width);
        doc.text(skillLines, margin, yPos);
        yPos += (lineHeight * skillLines.length) + lineHeight;
      }

      // Save the PDF
      doc.save(`${user.displayName.replace(/\s+/g, '_')}_Resume_Simple.pdf`);
      
      setSnackbarMessage('PDF downloaded successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSnackbarMessage('Error generating PDF. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleDownloadWord = () => {
    handleCloseMenu();
    try {
      const content = resumeRef.current.innerHTML;
      const converted = htmlDocx.asBlob(content);
      const url = window.URL.createObjectURL(converted);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user.displayName.replace(/\s+/g, '_')}_Resume.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSnackbarMessage('Word document downloaded successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error generating Word document:', error);
      setSnackbarMessage('Error generating Word document. Please try again.');
      setSnackbarOpen(true);
    }
  };

  if (loading || !resumeData) {
    return <Typography>Loading...</Typography>;
  }

  const Template = getTemplateById(selectedTemplate).component;

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <FormControl sx={{ minWidth: 200, mb: 2 }}>
              <InputLabel id="template-select-label">Template</InputLabel>
              <Select
                labelId="template-select-label"
                value={selectedTemplate}
                label="Template"
                onChange={handleTemplateChange}
              >
                {templates.map(template => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Template Info */}
            <Paper sx={{ p: 2, bgcolor: 'background.paper', mt: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {getTemplateById(selectedTemplate).name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {getTemplateById(selectedTemplate).description}
              </Typography>
              
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Features:
              </Typography>
              <Box sx={{ mb: 2 }}>
                {getTemplateById(selectedTemplate).features.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5, bgcolor: 'primary.light', color: 'white' }}
                  />
                ))}
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Recommended for:
              </Typography>
              <Box>
                {getTemplateById(selectedTemplate).recommendedFor.map((rec, index) => (
                  <Chip
                    key={index}
                    label={rec}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            </Paper>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Share your resume with a public link">
              <Button
                variant="contained"
                color="primary"
                startIcon={<ShareIcon />}
                onClick={handleSharePublicly}
              >
                Share Publicly
              </Button>
            </Tooltip>
            <Tooltip title="Download options">
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadClick}
              >
                Download
              </Button>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItemMui onClick={handleDownloadHtml2PDF}>
                <PdfIcon sx={{ mr: 1 }} />
                Download Styled PDF
              </MenuItemMui>
              <MenuItemMui onClick={handleDownloadJsPDF}>
                <ArticleIcon sx={{ mr: 1 }} />
                Download Simple PDF
              </MenuItemMui>
              <MenuItemMui onClick={handleDownloadWord}>
                <WordIcon sx={{ mr: 1 }} />
                Download Word Document
              </MenuItemMui>
            </Menu>
          </Box>
        </Box>
      </Box>

      <Template ref={resumeRef} resumeData={resumeData} user={user} />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </>
  );
}
