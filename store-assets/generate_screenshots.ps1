Add-Type -AssemblyName System.Drawing

$W = 1080; $H = 1920
$out = "D:\TGVC\Workspace\OoruMitra\store-assets\screenshots"

function C($hex) {
    $h = $hex.TrimStart('#')
    [System.Drawing.Color]::FromArgb(255,
        [Convert]::ToInt32($h.Substring(0,2),16),
        [Convert]::ToInt32($h.Substring(2,2),16),
        [Convert]::ToInt32($h.Substring(4,2),16))
}

$cPri  = C "2E7D32"; $cPriD = C "1B5E20"; $cPriL = C "4CAF50"
$cAcc  = C "FF6F00"
$cBg   = C "F5F5F5"; $cSurf = C "FFFFFF"; $cSVar = C "E8F5E9"
$cTxt  = C "212121"; $cTxt2 = C "616161"; $cHint = C "9E9E9E"
$cBord = C "E0E0E0"; $cOk   = C "43A047"; $cStar = C "FDD835"
$cErr  = C "E53935"; $cInfo = C "1E88E5"; $cReq  = C "7B1FA2"
$cAgr  = C "558B2F"; $cVeh  = C "1565C0"; $cLiv  = C "6D4C41"; $cHard = C "546E7A"

function F($sz, $bold = $false) {
    $s = if ($bold) { [System.Drawing.FontStyle]::Bold } else { [System.Drawing.FontStyle]::Regular }
    New-Object System.Drawing.Font("Segoe UI", $sz, $s)
}
function B($c) { New-Object System.Drawing.SolidBrush($c) }
function Alpha($c, $a) { [System.Drawing.Color]::FromArgb($a, $c.R, $c.G, $c.B) }

function Fill-R($g, $x, $y, $w, $h, $c) {
    $br = B $c; $g.FillRectangle($br, $x, $y, $w, $h); $br.Dispose()
}
function Fill-RR($g, $x, $y, $w, $h, $r, $c) {
    $br = B $c
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $p.AddArc($x, $y, $r*2, $r*2, 180, 90)
    $p.AddArc($x+$w-$r*2, $y, $r*2, $r*2, 270, 90)
    $p.AddArc($x+$w-$r*2, $y+$h-$r*2, $r*2, $r*2, 0, 90)
    $p.AddArc($x, $y+$h-$r*2, $r*2, $r*2, 90, 90)
    $p.CloseFigure()
    $g.FillPath($br, $p); $br.Dispose(); $p.Dispose()
}
function Fill-Circ($g, $cx, $cy, $r, $c) {
    $br = B $c; $g.FillEllipse($br, $cx-$r, $cy-$r, $r*2, $r*2); $br.Dispose()
}
function Txt($g, $t, $f, $c, $x, $y) {
    $br = B $c; $g.DrawString($t, $f, $br, [float]$x, [float]$y); $br.Dispose()
}
function New-Canvas {
    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
    $g.Clear($cBg)
    return $bmp, $g
}
function StatusBar($g) {
    Fill-R $g 0 0 $W 80 $cPriD
    $f = F 26; Txt $g "9:41" $f $cSurf 50 22
    Txt $g "... WiFi  |||" $f $cSurf 730 22; $f.Dispose()
}
function Toolbar($g, $title, $sub = $null) {
    $h = if ($sub) { 150 } else { 130 }
    Fill-R $g 0 80 $W $h $cPri
    $yTitle = if ($sub) { 90 } else { 98 }
    $f = F 44 $true; Txt $g $title $f $cSurf 60 $yTitle; $f.Dispose()
    if ($sub) { $fs = F 28; Txt $g $sub $fs (Alpha $cSurf 200) 60 148; $fs.Dispose() }
    $pen = New-Object System.Drawing.Pen($cSurf, 4)
    foreach ($ly in @(105, 120, 135)) { $g.DrawLine($pen, 990, $ly, 1040, $ly) }
    $pen.Dispose()
}
function Card($g, $x, $y, $cw, $ch, $r = 18) {
    $sha = Alpha ([System.Drawing.Color]::Black) 14
    Fill-RR $g ($x+3) ($y+5) $cw $ch $r $sha
    Fill-RR $g $x $y $cw $ch $r $cSurf
}
function WorkerCard($g, $x, $y, $name, $wt, $village, $price, $rating, $avail) {
    $cw = $W - $x*2; $ch = 170
    Card $g $x $y $cw $ch
    Fill-Circ $g ($x+60) ($y+85) 44 $cSVar
    $fi = F 34; Txt $g "[W]" $fi $cPri ($x+32) ($y+62); $fi.Dispose()
    $fn = F 32 $true; Txt $g $name $fn $cTxt ($x+118) ($y+20); $fn.Dispose()
    if ($avail) {
        Fill-RR $g ($x+$cw-185) ($y+20) 170 38 19 (Alpha $cOk 30)
        $fa = F 22; Txt $g "Available" $fa $cOk ($x+$cw-178) ($y+28); $fa.Dispose()
    }
    $fw = F 26; Txt $g $wt $fw $cTxt2 ($x+118) ($y+62); $fw.Dispose()
    $fv = F 24; Txt $g "@ $village" $fv $cHint ($x+118) ($y+96); $fv.Dispose()
    $fp = F 30 $true; Txt $g "Rs.$price/day" $fp $cAcc ($x+118) ($y+128); $fp.Dispose()
    $fr = F 26; Txt $g "* $rating" $fr $cHint ($x+$cw-155) ($y+128); $fr.Dispose()
}
function ProductCard($g, $x, $y, $cw, $ch, $name, $price, $cat, $imgC) {
    Card $g $x $y $cw $ch
    Fill-RR $g ($x+12) ($y+12) ($cw-24) 160 12 $imgC
    $fcat = F 22; Txt $g $cat $fcat (Alpha $cSurf 220) ($x+22) ($y+22); $fcat.Dispose()
    $fn = F 28 $true; Txt $g $name $fn $cTxt ($x+12) ($y+186); $fn.Dispose()
    $fp = F 26; Txt $g $price $fp $cAcc ($x+12) ($y+224); $fp.Dispose()
    $fs = F 22; Txt $g "* 4.6" $fs $cHint ($x+$cw-90) ($y+226); $fs.Dispose()
}
function Chip($g, $x, $y, $label, $active) {
    $f = F 26; $sz = $g.MeasureString($label, $f); $f.Dispose()
    $cw = [int]$sz.Width + 48; $ch = 62
    if ($active) {
        Fill-RR $g $x $y $cw $ch 31 $cPri
    } else {
        Fill-RR $g $x $y $cw $ch 31 $cSurf
        $pen = New-Object System.Drawing.Pen($cBord, 2)
        $p2 = New-Object System.Drawing.Drawing2D.GraphicsPath
        $p2.AddArc($x, $y, 62, 62, 180, 90); $p2.AddArc($x+$cw-62, $y, 62, 62, 270, 90)
        $p2.AddArc($x+$cw-62, $y+$ch-62, 62, 62, 0, 90); $p2.AddArc($x, $y+$ch-62, 62, 62, 90, 90)
        $p2.CloseFigure(); $g.DrawPath($pen, $p2); $pen.Dispose(); $p2.Dispose()
    }
    $fc = F 26; $col = if ($active) { $cSurf } else { $cTxt2 }
    Txt $g $label $fc $col ($x+24) ($y+16); $fc.Dispose()
    return ($x + $cw + 18)
}
function BottomNav($g) {
    Fill-R $g 0 ($H-320) $W 2 $cBord
    Fill-R $g 0 ($H-318) $W 100 $cSurf
    $items = @("Home", "Workers", "Products", "Chat", "Profile")
    $cols  = @($cPri, $cHint, $cHint, $cHint, $cHint)
    for ($i = 0; $i -lt 5; $i++) {
        $xi = 30 + $i*208; $f = F 24
        Txt $g $items[$i] $f $cols[$i] $xi ($H-302); $f.Dispose()
    }
}
function Banner($g, $hl, $sub) {
    Fill-R $g 0 ($H-220) $W 220 $cPriD
    $fh = F 44 $true; Txt $g $hl $fh $cSurf 60 ($H-195); $fh.Dispose()
    $fs = F 30; Txt $g $sub $fs (Alpha $cSurf 185) 60 ($H-130); $fs.Dispose()
}
function SectionHead($g, $title, $y) {
    $f = F 36 $true; Txt $g $title $f $cTxt 50 $y; $f.Dispose()
}

# ══════════════════════════════════════
# 1 – Home Dashboard
# ══════════════════════════════════════
$bmp, $g = New-Canvas
StatusBar $g
Toolbar $g "OoruMitra" "Good morning, Ravi!  Nalgonda"

Card $g 40 262 ($W-80) 88 44
$fs = F 30; Txt $g "Search workers, products, services..." $fs $cHint 100 286
Txt $g "[mic]" $fs $cPri 985 286; $fs.Dispose()

SectionHead $g "Categories" 382
$cats = @(
    @("W", "Workers",     $cAgr),  @("S", "Products",    $cHard),
    @("T", "Vehicle Work",$cVeh),  @("R", "Transport",   $cLiv),
    @("!", "Requests",    $cReq),  @("+", "Emergency",   $cErr),
    @("#", "Govt",        $cInfo), @("*", "Nearby Map",  $cOk)
)
for ($i = 0; $i -lt 8; $i++) {
    $col = $i % 4; $row = [int]($i / 4)
    $tx = 50 + $col*248; $ty = 432 + $row*196
    Card $g $tx $ty 220 166 16
    $ic = Alpha $cats[$i][2] 35; Fill-Circ $g ($tx+110) ($ty+68) 40 $ic
    $fi = F 36 $true; Txt $g $cats[$i][0] $fi $cats[$i][2] ($tx+93) ($ty+48); $fi.Dispose()
    $fl = F 24; Txt $g $cats[$i][1] $fl $cTxt ($tx+10) ($ty+122); $fl.Dispose()
}

$fsh = F 36 $true; Txt $g "Nearby Services" $fsh $cTxt 50 848; $fsh.Dispose()
$fsa = F 28; Txt $g "See all >" $fsa $cPri 840 853; $fsa.Dispose()
WorkerCard $g 40 896  "Suresh Kumar"  "MASON WORK" "Miryalaguda" "650" "4.8" $true
WorkerCard $g 40 1086 "Raju Reddy"    "ELECTRICAL"  "Nalgonda"   "550" "4.5" $false

BottomNav $g
Banner $g "Your Village Marketplace" "Shop, Hire, Connect, Near You"
$bmp.Save("$out\01_home_dashboard.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output "1/6 Home Dashboard"

# ══════════════════════════════════════
# 2 – Worker Services
# ══════════════════════════════════════
$bmp, $g = New-Canvas
StatusBar $g
Toolbar $g "Worker Services"

$cx = 50
foreach ($ch in @(@("All",$true),@("Harvesting",$false),@("Mason",$false),@("Electrical",$false),@("Borewell",$false))) {
    $cx = Chip $g $cx 228 $ch[0] $ch[1]
}

WorkerCard $g 40 312  "Suresh Kumar"   "MASON WORK"    "Miryalaguda"    "650" "4.8" $true
WorkerCard $g 40 502  "Raju Reddy"     "ELECTRICAL"    "Nalgonda"       "550" "4.5" $false
WorkerCard $g 40 692  "Laxmaiah Yadav" "HARVESTING"    "Suryapet"       "400" "4.7" $true
WorkerCard $g 40 882  "Kiran Babu"     "PLUMBING"      "Bhongir"        "480" "4.3" $true
WorkerCard $g 40 1072 "Siva Prasad"    "BOREWELL WORK" "Yadagirigutta"  "750" "4.9" $true

$fc = F 28; Txt $g "24 workers found nearby" $fc $cTxt2 50 1260; $fc.Dispose()

Fill-Circ $g 1020 ($H-380) 56 $cPri
$ff = F 50 $true; Txt $g "+" $ff $cSurf 992 ($H-418); $ff.Dispose()

BottomNav $g
Banner $g "Hire Skilled Local Workers" "Verified, Available, Affordable"
$bmp.Save("$out\02_worker_services.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output "2/6 Worker Services"

# ══════════════════════════════════════
# 3 – Product Marketplace
# ══════════════════════════════════════
$bmp, $g = New-Canvas
StatusBar $g
Toolbar $g "Products"

$cx2 = 50
foreach ($ch in @(@("All",$true),@("Seeds",$false),@("Fertilizers",$false),@("Tools",$false),@("Vegetables",$false))) {
    $cx2 = Chip $g $cx2 228 $ch[0] $ch[1]
}

$pw = [int](($W-120)/2); $ph = 290
$prods = @(
    @("Paddy Seeds (5kg)",  "Rs.480",   "SEEDS",      (C "8BC34A")),
    @("DAP Fertilizer",     "Rs.1,250", "FERTILIZER", (C "F57C00")),
    @("Spray Pump",         "Rs.3,500", "TOOLS",      (C "0288D1")),
    @("Fresh Tomatoes",     "Rs.60/kg", "VEGETABLES", (C "E53935")),
    @("NPK Fertilizer",     "Rs.950",   "FERTILIZER", (C "F57C00")),
    @("Weeding Sickle",     "Rs.280",   "TOOLS",      (C "607D8B"))
)
for ($i = 0; $i -lt 6; $i++) {
    $col = $i % 2; $row = [int]($i / 2)
    $px = 50 + $col*($pw+20); $py = 312 + $row*($ph+16)
    ProductCard $g $px $py $pw $ph $prods[$i][0] $prods[$i][1] $prods[$i][2] $prods[$i][3]
}

BottomNav $g
Banner $g "Buy and Sell Farm Products" "Seeds, Fertilizers, Tools, Vegetables"
$bmp.Save("$out\03_product_marketplace.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output "3/6 Product Marketplace"

# ══════════════════════════════════════
# 4 – Nearby Map
# ══════════════════════════════════════
$bmp, $g = New-Canvas
StatusBar $g
Toolbar $g "Nearby Services"

$cx3 = 50
foreach ($ch in @(@("All",$true),@("Workers",$false),@("Products",$false),@("Vehicles",$false),@("Transport",$false))) {
    $cx3 = Chip $g $cx3 228 $ch[0] $ch[1]
}

Fill-R $g 0 308 $W ($H-308-220-100) (C "E8F5E9")
$pen = New-Object System.Drawing.Pen((C "C8E6C9"), 3)
for ($gx = 0; $gx -lt $W; $gx += 180) { $g.DrawLine($pen, $gx, 308, $gx, ($H-320)) }
for ($gy = 308; $gy -lt ($H-320); $gy += 140) { $g.DrawLine($pen, 0, $gy, $W, $gy) }
$pen.Dispose()
$pen2 = New-Object System.Drawing.Pen((C "B2DFDB"), 5)
$g.DrawLine($pen2, 0, 590, $W, 590); $g.DrawLine($pen2, 0, 868, $W, 868)
$g.DrawLine($pen2, 360, 308, 360, ($H-320)); $g.DrawLine($pen2, 720, 308, 720, ($H-320))
$pen2.Dispose()

$pins = @(
    @(280, 480,  "W", $cAgr,  "Suresh (Mason)"),
    @(540, 560,  "T", $cVeh,  "Tractor Service"),
    @(820, 620,  "S", $cHard, "Raju Stores"),
    @(400, 720,  "W", $cAgr,  "Kiran (Electr.)"),
    @(680, 800,  "R", $cLiv,  "Transport Co."),
    @(200, 860,  "+", $cErr,  "PHC Hospital"),
    @(900, 760,  "S", $cHard, "AgriShop"),
    @(540, 920,  "!", $cReq,  "Help Request")
)
foreach ($pin in $pins) {
    $px2 = [int]$pin[0]; $py2 = [int]$pin[1]
    Fill-Circ $g ($px2+3) ($py2+34) 28 (Alpha ([System.Drawing.Color]::Black) 22)
    Fill-Circ $g $px2 $py2 32 $pin[3]
    $fpi = F 26 $true; Txt $g $pin[2] $fpi $cSurf ($px2-13) ($py2-14); $fpi.Dispose()
    $pts = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new($px2-10, $py2+28),
        [System.Drawing.PointF]::new($px2+10, $py2+28),
        [System.Drawing.PointF]::new($px2, $py2+48)
    )
    $ptbr = B $pin[3]; $g.FillPolygon($ptbr, $pts); $ptbr.Dispose()
    Card $g ($px2+36) ($py2-22) 180 44 8
    $flb = F 22; Txt $g $pin[4] $flb $cTxt ($px2+46) ($py2-12); $flb.Dispose()
}

Fill-Circ $g 540 700 14 (Alpha $cSurf 200)
Fill-Circ $g 540 700 10 $cInfo
$fpulse = New-Object System.Drawing.Pen((Alpha $cInfo 70), 4)
$g.DrawEllipse($fpulse, 514, 674, 52, 52); $fpulse.Dispose()

Card $g 30 ($H-560) 460 210 14
$fleg = F 28 $true; Txt $g "Legend" $fleg $cTxt 58 ($H-545); $fleg.Dispose()
$legItems = @(@($cAgr,"Workers"),@($cVeh,"Vehicle Work"),@($cHard,"Products"),@($cLiv,"Transport"),@($cErr,"Emergency"))
for ($li = 0; $li -lt 5; $li++) {
    $ly = $H-500+$li*38; Fill-Circ $g 66 $ly 12 $legItems[$li][0]
    $fl2 = F 24; Txt $g $legItems[$li][1] $fl2 $cTxt 88 ($ly-16); $fl2.Dispose()
}

BottomNav $g
Banner $g "Discover Services Near You" "Real-time map of 50 km radius"
$bmp.Save("$out\04_nearby_map.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output "4/6 Nearby Map"

# ══════════════════════════════════════
# 5 – Real-time Chat
# ══════════════════════════════════════
$bmp, $g = New-Canvas
StatusBar $g
Toolbar $g "Messages"

$convos = @(
    @("Suresh Kumar",  "Regarding mason work quote", "10:32", "2", $true),
    @("Raju Agri Store","Seeds stock available now", "9:15",  "0", $false),
    @("Laxmaiah Yadav","Will come tomorrow morning",  "Yesterday","0",$false),
    @("Kiran Transport","Route confirmed for Friday", "Mon",   "1", $true)
)
$cy = 230
foreach ($cv in $convos) {
    Card $g 20 $cy ($W-40) 118 0
    Fill-Circ $g 78 ($cy+59) 40 $cSVar
    $fa = F 32 $true; Txt $g $cv[0].Substring(0,1) $fa $cPri 62 ($cy+40); $fa.Dispose()
    $fn = F 32 $true; Txt $g $cv[0] $fn $cTxt 138 ($cy+18); $fn.Dispose()
    $fm = F 26; Txt $g $cv[1] $fm $cHint 138 ($cy+62); $fm.Dispose()
    $ft = F 24; Txt $g $cv[2] $ft $cHint ($W-140) ($cy+18); $ft.Dispose()
    if ($cv[3] -ne "0") {
        Fill-Circ $g ($W-68) ($cy+66) 22 $cErr
        $fb = F 22 $true; Txt $g $cv[3] $fb $cSurf ($W-78) ($cy+52); $fb.Dispose()
    }
    $pen = New-Object System.Drawing.Pen($cBord, 1)
    $g.DrawLine($pen, 138, ($cy+116), $W-20, ($cy+116)); $pen.Dispose()
    $cy += 120
}

Fill-R $g 0 728 $W 2 $cBord
Fill-R $g 0 730 $W 80 $cPri
$fcht = F 30 $true; Txt $g "< Suresh Kumar" $fcht $cSurf 50 748; $fcht.Dispose()
$fst = F 26; Txt $g "Online" $fst (Alpha $cSurf 200) 820 754; $fst.Dispose()
Fill-Circ $g 798 762 8 $cPriL

Fill-R $g 0 810 $W 782 (C "F1F8E9")

$bubbles = @(
    @("Hello, I need mason work for my house", $false, 830),
    @("How many days required?",               $true,  930),
    @("Around 5 days I think",                 $false, 1030),
    @("My rate is Rs.650 per day. When start?",$true,  1130),
    @("Can you come this Saturday?",           $false, 1230),
    @("Yes, available Saturday",               $true,  1330),
    @("Great! Will send the address",          $false, 1430)
)
foreach ($bub in $bubbles) {
    $txt = $bub[0]; $sent = $bub[1]; $by = $bub[2]
    $fw = F 28; $sz = $g.MeasureString($txt, $fw); $fw.Dispose()
    $bw = [int][Math]::Min($sz.Width + 56, $W * 0.72); $bh = 72
    if ($sent) {
        $bx = $W - $bw - 30
        Fill-RR $g $bx $by $bw $bh 20 $cPri
        $fb = F 28; Txt $g $txt $fb $cSurf ($bx+28) ($by+18); $fb.Dispose()
        $ft2 = F 20; Txt $g "10:32  vv" $ft2 (Alpha $cSurf 160) ($bx+$bw-150) ($by+$bh+4); $ft2.Dispose()
    } else {
        $bx = 30
        Fill-RR $g $bx $by $bw $bh 20 $cSurf
        $fb = F 28; Txt $g $txt $fb $cTxt ($bx+28) ($by+18); $fb.Dispose()
        $ft2 = F 20; Txt $g "10:30" $ft2 $cHint ($bx+8) ($by+$bh+4); $ft2.Dispose()
    }
}

Fill-R $g 0 1540 $W 2 $cBord
Fill-R $g 0 1542 $W 90 $cSurf
Fill-RR $g 20 1556 ($W-160) 64 32 (C "F5F5F5")
$fi = F 28; Txt $g "Type a message..." $fi $cHint 48 1570; $fi.Dispose()
Fill-Circ $g 1030 1590 34 $cPri
$fsend = F 36 $true; Txt $g ">" $fsend $cSurf 1015 1570; $fsend.Dispose()

Banner $g "Chat with Buyers and Sellers" "Real-time messaging, Instant connect"
$bmp.Save("$out\05_realtime_chat.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output "5/6 Real-time Chat"

# ══════════════════════════════════════
# 6 – Multi-language
# ══════════════════════════════════════
$bmp, $g = New-Canvas
StatusBar $g
Toolbar $g "Language and Voice"

SectionHead $g "Select Language" 234

$langs = @(
    @("English",  "Select your preferred language",    "EN", $true),
    @("Telugu",   "Mee ishtamaina bhasanu entukondi",  "TE", $false),
    @("Hindi",    "Apni pasandeeda bhasha chunein",     "HI", $false),
    @("Tamil",    "Ungal virupmana mozhi terendedukka", "TA", $false),
    @("Kannada",  "Ninna aadyateyya bhasheyanu aayke",  "KN", $false)
)
$ly2 = 290
foreach ($lang in $langs) {
    Card $g 30 $ly2 ($W-60) 142 14
    if ($lang[3]) {
        Fill-R $g 30 $ly2 8 142 $cPri
        $fchk = F 38 $true; Txt $g "v" $fchk $cPri 56 ($ly2+46); $fchk.Dispose()
    }
    $lx = if ($lang[3]) { 112 } else { 62 }
    $fn2 = F 36 $true; Txt $g $lang[0] $fn2 $cTxt $lx ($ly2+26); $fn2.Dispose()
    $fs2 = F 26; Txt $g $lang[1] $fs2 $cTxt2 $lx ($ly2+76); $fs2.Dispose()
    Fill-RR $g ($W-122) ($ly2+48) 82 44 22 $cSVar
    $fb = F 24 $true; Txt $g $lang[2] $fb $cPri ($W-112) ($ly2+60); $fb.Dispose()
    $ly2 += 158
}

Fill-R $g 0 1106 $W 2 $cBord
SectionHead $g "Voice Search" 1124

Card $g 30 1172 ($W-60) 250 14
$fvt = F 32 $true; Txt $g "Tap and Speak in Your Language" $fvt $cTxt 90 1192; $fvt.Dispose()
$fvs = F 26; Txt $g "Search by voice in Telugu, Hindi, and more" $fvs $cTxt2 70 1244; $fvs.Dispose()
Fill-Circ $g ($W/2) 1338 70 $cPri
$fmic = F 50 $true; Txt $g "mic" $fmic $cSurf (($W/2)-42) 1314; $fmic.Dispose()

Banner $g "Available in 5 Indian Languages" "English, Telugu, Hindi, Tamil, Kannada"
$bmp.Save("$out\06_multilanguage.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output "6/6 Multi-language"

# ══════════════════════════════════════
# Feature Graphic – 1024 x 500
# ══════════════════════════════════════
$FW = 1024; $FH = 500
$fbmp = New-Object System.Drawing.Bitmap($FW, $FH)
$fg2  = [System.Drawing.Graphics]::FromImage($fbmp)
$fg2.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$fg2.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    [System.Drawing.Point]::new(0, 0),
    [System.Drawing.Point]::new($FW, $FH),
    $cPriD, (C "2E7D32"))
$fg2.FillRectangle($grad, 0, 0, $FW, $FH); $grad.Dispose()

Fill-Circ $fg2 920 80  120 (Alpha $cPriL 40)
Fill-Circ $fg2 100 420 90  (Alpha $cPriL 30)
Fill-Circ $fg2 800 430 60  (Alpha $cPriL 25)

# House icon (scaled to 110px, anchored at 165,75)
$s = 110.0/108.0
function HS($v) { return [int]($v * $s + 165) }
function HSY($v) { return [int]($v * $s + 75) }
Fill-Circ $fg2 (HS 54) (HSY 26) ([int](7*$s)) (Alpha $cPriL 180)
$rfPts = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new((HS 54), (HSY 38)),
    [System.Drawing.PointF]::new((HS 22), (HSY 60)),
    [System.Drawing.PointF]::new((HS 86), (HSY 60))
)
$rfBr = B $cSurf; $fg2.FillPolygon($rfBr, $rfPts); $rfBr.Dispose()
$bbr = B $cSurf; $fg2.FillRectangle($bbr, (HS 28), (HSY 60), [int](52*$s), [int](26*$s)); $bbr.Dispose()
$dbr = B $cPriD; $fg2.FillRectangle($dbr, (HS 44), (HSY 70), [int](16*$s), [int](16*$s)); $dbr.Dispose()

$fBig = New-Object System.Drawing.Font("Segoe UI", 86, [System.Drawing.FontStyle]::Bold)
Txt $fg2 "OoruMitra" $fBig $cSurf 300 110; $fBig.Dispose()

$fTag = F 36; Txt $fg2 "Your Village's Digital Marketplace" $fTag (Alpha $cSurf 210) 300 222; $fTag.Dispose()

$pills2 = @("Hire Workers", "Buy Products", "Book Transport", "Real-time Chat")
$px3 = 300
foreach ($pill in $pills2) {
    $fp = F 26; $psz = $fg2.MeasureString($pill, $fp); $fp.Dispose()
    $pw2 = [int]$psz.Width + 40
    Fill-RR $fg2 $px3 304 $pw2 52 26 (Alpha $cSurf 25)
    $fp2 = F 26; Txt $fg2 $pill $fp2 $cSurf ($px3+20) 317; $fp2.Dispose()
    $px3 += $pw2 + 12
}

Fill-R $fg2 300 382 440 3 (Alpha $cSurf 110)
$fBot = F 26; Txt $fg2 "Available in EN, TE, HI, TA, KN" $fBot (Alpha $cSurf 155) 300 398; $fBot.Dispose()

$fbmp.Save("$out\..\feature_graphic.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fg2.Dispose(); $fbmp.Dispose()
Write-Output "Feature Graphic (1024x500)"
Write-Output ""
Write-Output "Done. Assets saved to: $out"
