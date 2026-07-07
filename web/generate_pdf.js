import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'

const targetPdfPath = path.resolve('../Oorumitra_demo_slideshow.pdf')
const doc = new PDFDocument({
  layout: 'landscape',
  size: 'A4',
  margin: 36
})

// Output stream
const writeStream = fs.createWriteStream(targetPdfPath)
doc.pipe(writeStream)

// Slides config list
const slides = [
  {
    title: 'OoruMitra - Rural Digital Marketplace & Companion',
    description: 'Connecting village communities digitally through a comprehensive platform. OoruMitra supports localized agricultural commerce, certified local services marketplace, rental & job listings, and community notifications.\n\nCreated and engineered with custom high-fidelity dashboards, interactive media sliders, and modular micro-services.',
    image: null
  },
  {
    title: 'Scene 1: Interactive Video Presentation (English)',
    description: 'The 60-second social media promotional Reels/Shorts advertisement screen. Shows the village presenter welcoming users in English. Synthesizes positive cultural fusion music in the background.',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/promo_english_scene1_1783098990104.png'
  },
  {
    title: 'Scene 1: Automatic Dialog Translations (Telugu)',
    description: 'Selecting "Telugu" instantly updates on-screen typography, speech balloon graphics, and subtitles. Provides a real-time translation player without reloading assets.',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/promo_telugu_scene1_1783099018198.png'
  },
  {
    title: 'Scene 4: Jobs, Rentals & Leases (Hindi)',
    description: 'Scene 4 showcase presenting local rentals, house leases, and job opportunities with fully localized Hindi typography and spoken transcript captions.',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/promo_hindi_scene4_1783099095427.png'
  },
  {
    title: 'Super Admin: Availability Status Override Timeline',
    description: 'Super Admin dashboard allows overriding product availability (ACTIVE <-> INACTIVE) with mandatory logs remarks. Retains a detailed audit trail of status shifts and who modified it.',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/admin_audit_logs_1783096809068.png'
  },
  {
    title: 'Seller Dashboard: Manage Products Availability',
    description: 'My Products tab under the profile page offers sellers a dashboard to view active/inactive items, track their admin approval state, creation dates, last updated timestamps, and toggle status instantly.',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/seller_dashboard_active_1783097092483.png'
  },
  {
    title: 'Mobile View: Cinematic village Banner Slider',
    description: 'Golden village sunset flythrough header scaled for mobile viewport aspect ratios. Cycles seamlessly between Cinematic Village 3D Hero and active admin-sponsored ads.',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/mobile_simulator_slide_0_1782993048061.png'
  },
  {
    title: 'Mobile View: Banner Advertisement Slider',
    description: 'High-priority Panchayat seed subsidies advertisement slider formatted with responsive CSS3 grid overlays and clickable buttons for standard mobile screen sizes.',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/mobile_simulator_slide_1_1782993063282.png'
  }
]

slides.forEach((slide, index) => {
  if (index > 0) {
    doc.addPage()
  }

  // Draw Page border/Accent header
  doc.rect(15, 15, 811.89, 12).fill('#4f46e5')
  doc.rect(15, 565, 811.89, 12).fill('#1e1b4b')

  // Slide Number
  doc.fillColor('#4f46e5')
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(`SLIDE ${index + 1} OF ${slides.length}`, 36, 40)

  // Title
  doc.fillColor('#0f172a')
    .font('Helvetica-Bold')
    .fontSize(20)
    .text(slide.title, 36, 55, { width: 770 })

  // Divider
  doc.moveTo(36, 85).lineTo(805, 85).strokeColor('#e2e8f0').lineWidth(1).stroke()

  if (slide.image && fs.existsSync(slide.image)) {
    // Two-column layout: Left column description, Right column image
    doc.fillColor('#334155')
      .font('Helvetica')
      .fontSize(12)
      .text(slide.description, 36, 110, { width: 340, lineGap: 4 })

    // Draw Image
    doc.image(slide.image, 400, 110, {
      fit: [390, 400],
      align: 'center',
      valign: 'center'
    })
  } else {
    // Full width description for Title slide
    doc.fillColor('#334155')
      .font('Helvetica')
      .fontSize(14)
      .text(slide.description, 36, 150, { width: 750, lineGap: 6 })

    // Slogan
    doc.fillColor('#4f46e5')
      .font('Helvetica-Oblique')
      .fontSize(16)
      .text('"Connecting Villages, Empowering Communities"', 36, 380, { align: 'center', width: 750 })
  }

  // Footer Attribution
  doc.fillColor('#94a3b8')
    .font('Helvetica-Bold')
    .fontSize(8)
    .text('Product Plan, Design & Implementation by Obulareddy Thavva | obulareddyjd@gmail.com | Full Stack AI Engineer', 36, 545, { align: 'center', width: 770 })
})

doc.end()

writeStream.on('finish', () => {
  console.log('PDF presentation built successfully at: ' + targetPdfPath)
})
