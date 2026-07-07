import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'

const targetPdfPath = path.resolve('../OoruMitra_Sscreenshots.pdf')
const doc = new PDFDocument({
  layout: 'landscape',
  size: 'A4',
  margin: 36
})

// Output stream
const writeStream = fs.createWriteStream(targetPdfPath)
doc.pipe(writeStream)

// 17 Screens description config list
const slides = [
  {
    title: 'Screen 01 – Splash Screen',
    filename: '01_Home_Splash.png',
    description: 'The entrance experience of the OoruMitra mobile application.\n\nKey UI Elements:\n• Main branding OoruMitra Logo (🌾)\n• Slogan: "Connecting Villages Digitally"\n• Vibrant green/indigo sunrise gradient backdrop\n• Material Design 3 loading indicator',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/01_home_splash_1783228376075.png'
  },
  {
    title: 'Screen 02 – Login Screen',
    filename: '02_Login.png',
    description: 'Clean user authentication screen supporting secure login.\n\nKey UI/UX Elements:\n• Material Design 3 Input Fields (Username/Password)\n• Prominent "Login" action button in primary theme green\n• "Forgot Password?" fast link option\n• Outline "Create Account" secondary trigger',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/02_login_1783228390272.png'
  },
  {
    title: 'Screen 03 – User Registration',
    filename: '03_User_Registration.png',
    description: 'Comprehensive registration form to join the OoruMitra village platform.\n\nKey UI/UX Elements:\n• Mandatory field indicators (*)\n• Multi-column inputs (First Name, Last Name, Mobile, Village details)\n• Mobile validation compatibility styling\n• Clean call-to-action "Register" button',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/03_user_registration_1783228391094.png'
  },
  {
    title: 'Screen 04 – Home Dashboard',
    filename: '04_Home_Dashboard.png',
    description: 'The core navigation dashboard of OoruMitra displaying all rural service domains.\n\nKey UI/UX Elements:\n• Location indicators & notification bell\n• Golden sunset background ad banner slider\n• 3x3 Grid showing village categories with high-quality Material icons\n• Solid bottom navigation tabs bar',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/04_home_dashboard_1783228391934.png'
  },
  {
    title: 'Screen 05 – Open User Profile',
    filename: '05_Profile_View.png',
    description: 'Sellers and users account overview details.\n\nKey UI/UX Elements:\n• Circular initials avatar badge (OT)\n• Full User details (Name, Email, Role)\n• Action lists menu: My Listings, Favorites, Settings\n• Red outline Logout button',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/05_profile_view_1783228392760.png'
  },
  {
    title: 'Screen 06 – Post Advertisement',
    filename: '06_Post_Advertisement.png',
    description: 'Ad posting form allowing sellers to describe and rate their products.\n\nKey UI/UX Elements:\n• Category selector dropdown (Agriculture, Cattle, etc.)\n• Dynamic fields: Title, Text description, Amount\n• Upload Photos placeholder box\n• "Publish Advertisement" solid action button',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/06_post_advertisement_1783228410634.png'
  },
  {
    title: 'Screen 07 – Product Posted Successfully',
    filename: '07_Post_Success.png',
    description: 'Clean transaction success confirmation popup.\n\nKey UI/UX Elements:\n• Green circular verification check icon\n• Message: "Your advertisement has been submitted successfully"\n• Pending admin verification yellow warning badge\n• Solid "Back to Home" primary button',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/07_post_success_1783228411879.png'
  },
  {
    title: 'Screen 08 – My Posted Products',
    filename: '08_My_Products.png',
    description: 'Personal Seller Listings catalog showcasing statuses.\n\nKey UI/UX Elements:\n• Grouped listing elements showing photos, titles, and prices\n• Approval states color tags (APPROVED = Green, PENDING = Amber, REJECTED = Red)\n• Dynamic edit listing actions button',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/08_my_products_1783228413152.png'
  },
  {
    title: 'Screen 09 – Workers Listings',
    filename: '09_Workers_List.png',
    description: 'Local directory of verified village service professionals.\n\nKey UI/UX Elements:\n• Grouped by roles (Electrician, Plumber, Carpenter, Mason)\n• Showcases experience stats (e.g. 5 Years Exp)\n• Quick-click primary "Call" buttons',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/09_workers_list_1783228414514.png'
  },
  {
    title: 'Screen 10 – Vehicle Listings',
    filename: '10_Vehicles_List.png',
    description: 'Agriculture and construction vehicles rental directory.\n\nKey UI/UX Elements:\n• Listings showing Tractors, Pickups, JCBs\n• Displays rental rates: ₹1,200/hr, ₹2,500/day\n• Location tag and action "Book" buttons',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/10_vehicles_list_1783228416070.png'
  },
  {
    title: 'Screen 11 – Transport Services',
    filename: '11_Transport_Services.png',
    description: 'Village transport and crop cargo options.\n\nKey UI/UX Elements:\n• Items: Goods Auto, sand tippers, crop loaders\n• Displays driver name and contact stats\n• Direct click to call buttons for transport booking',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/11_transport_services_1783228430340.png'
  },
  {
    title: 'Screen 12 – Emergency Services Dashboard',
    filename: '12_Emergency_Home.png',
    description: 'Red themed emergency lifelines dashboard.\n\nKey UI/UX Elements:\n• Red styling alerting urgency\n• 2x3 grid: Ambulance, Hospital, Police, Fire, Blood Bank, Veterinary Dr\n• Immediate quick navigation icons',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/12_emergency_home_1783228431376.png'
  },
  {
    title: 'Screen 13 – Ambulance Service',
    filename: '13_Ambulance_Service.png',
    description: 'Real-time closest village ambulance locator.\n\nKey UI/UX Elements:\n• Circular pulse effect ambulance icon\n• Displays driver name (K. Shiva), mobile, and distance (3.5 km)\n• Status availability tag (Available)\n• Red call ambulance action button',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/13_ambulance_service_1783228432787.png'
  },
  {
    title: 'Screen 14 – Hospital Service',
    filename: '14_Hospital_Service.png',
    description: 'Nearest government and private health clinic listings.\n\nKey UI/UX Elements:\n• Lists hospital names and primary doctors\n• Distance indicators (1.8 km, 4.2 km)\n• Direct call and navigation map direction triggers',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/14_hospital_service_1783228433951.png'
  },
  {
    title: 'Screen 15 – Police Service',
    filename: '15_Police_Service.png',
    description: 'Local police station emergency desk details.\n\nKey UI/UX Elements:\n• Police station info cards\n• Station Officer (SI G. Venkatesh) name and contact numbers\n• Large red "Emergency Contact (100)" call trigger',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/15_police_service_1783228434831.png'
  },
  {
    title: 'Screen 16 – Admin Verification',
    filename: '16_Admin_Verification.png',
    description: 'Super Admin moderation panel to approve/reject advertisements.\n\nKey UI/UX Elements:\n• Moderation queue element showing listing details\n• Remarks text area inputs\n• Green "Approve" and red "Reject" action triggers',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/16_admin_verification_1783228450844.png'
  },
  {
    title: 'Screen 17 – Final Marketing Screen',
    filename: '17_Final_Marketing.png',
    description: 'Platform summary slide for application marketing.\n\nKey UI/UX Elements:\n• App logo & tagline: "One App for Every Village Need"\n• Listed features list checkmarks\n• App store download badges mockup links',
    image: 'C:/Users/LENOVO/.gemini/antigravity-ide/brain/b86b39ba-bccc-4b42-9422-8d1aa21fd2e6/17_final_marketing_1783228451988.png'
  }
]

slides.forEach((slide, index) => {
  if (index > 0) {
    doc.addPage()
  }

  // Draw Page border/Accent header
  doc.rect(15, 15, 811.89, 12).fill('#15803d') // Green primary theme
  doc.rect(15, 565, 811.89, 12).fill('#1e1b4b')

  // Slide Number
  doc.fillColor('#ea580c') // Orange theme accent
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(`SCREEN ${index + 1} OF ${slides.length}`, 36, 40)

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
      .text(slide.description, 36, 110, { width: 440, lineGap: 5 })

    doc.fillColor('#64748b')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(`File Name: ${slide.filename}`, 36, 480)

    // Draw Image
    doc.image(slide.image, 500, 100, {
      fit: [270, 450],
      align: 'center',
      valign: 'center'
    })
  } else {
    // Full width description for Title slide
    doc.fillColor('#334155')
      .font('Helvetica')
      .fontSize(14)
      .text(slide.description, 36, 150, { width: 750, lineGap: 6 })
  }

  // Footer Attribution
  doc.fillColor('#94a3b8')
    .font('Helvetica-Bold')
    .fontSize(8)
    .text('Product Plan, Design & Implementation by Obulareddy Thavva | obulareddyjd@gmail.com | Full Stack AI Engineer', 36, 545, { align: 'center', width: 770 })
})

doc.end()

writeStream.on('finish', () => {
  console.log('PDF mobile screenshots walkthrough built successfully at: ' + targetPdfPath)
})
