package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lohakit/cms-backend/internal/config"
	"github.com/lohakit/cms-backend/internal/domain"
	"github.com/lohakit/cms-backend/internal/repository/sqlc"
	"github.com/lohakit/cms-backend/internal/service"
	"github.com/lohakit/cms-backend/pkg/hasher"
)

func main() {
	cfg := config.Load()
	ctx := context.Background()

	pool, err := pgxpool.New(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer pool.Close()

	queries := sqlc.New(pool)
	fmt.Println("Seeding CHIOTRON TECHNOLOGY CMS database...")

	// 1. Seed Permissions
	permissions := []struct {
		Code   string
		Module string
		Desc   string
	}{
		{"dashboard.view", "dashboard", "View dashboard analytics and statistics"},
		{"users.read", "users", "View system users, roles and permissions"},
		{"users.create", "users", "Create new system users"},
		{"users.update", "users", "Update system users"},
		{"users.delete", "users", "Deactivate and delete users"},
		{"page.read", "page", "View pages and sections"},
		{"page.create", "page", "Create new pages"},
		{"page.update", "page", "Edit pages and page builder sections"},
		{"page.delete", "page", "Delete pages"},
		{"page.publish", "page", "Publish and unpublish pages"},
		{"product.read", "product", "View metal packaging products"},
		{"product.create", "product", "Create products and categories"},
		{"product.update", "product", "Edit products and technical specifications"},
		{"product.delete", "product", "Delete products"},
		{"news.read", "news", "View news and sustainability articles"},
		{"news.create", "news", "Create news articles"},
		{"news.update", "news", "Edit news articles"},
		{"news.delete", "news", "Delete news articles"},
		{"media.read", "media", "View media library assets"},
		{"media.upload", "media", "Upload new media assets"},
		{"media.update", "media", "Replace media assets and update metadata"},
		{"media.delete", "media", "Delete media assets"},
		{"settings.read", "settings", "View system settings and themes"},
		{"settings.update", "settings", "Update company settings and switch themes"},
		{"audit.read", "audit", "View audit trail logs"},
		{"trash.restore", "trash", "Restore items from trash"},
		{"trash.permanent_delete", "trash", "Permanently purge records"},
	}

	permMap := make(map[string]uuid.UUID)
	for _, p := range permissions {
		var pID uuid.UUID
		err := pool.QueryRow(ctx, `
			INSERT INTO permissions (code, module, description)
			VALUES ($1, $2, $3)
			ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description
			RETURNING id
		`, p.Code, p.Module, p.Desc).Scan(&pID)
		if err == nil {
			permMap[p.Code] = pID
		}
	}

	// 2. Seed Roles
	var superAdminRoleID, editorRoleID uuid.UUID
	_ = pool.QueryRow(ctx, `
		INSERT INTO roles (name, description, is_system)
		VALUES ('Superadmin', 'Full system access and security administration', TRUE)
		ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
		RETURNING id
	`).Scan(&superAdminRoleID)

	_ = pool.QueryRow(ctx, `
		INSERT INTO roles (name, description, is_system)
		VALUES ('Editor', 'Content and product catalog management', FALSE)
		ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
		RETURNING id
	`).Scan(&editorRoleID)

	// Assign all permissions to Superadmin
	for _, pID := range permMap {
		_, _ = pool.Exec(ctx, `
			INSERT INTO role_permissions (role_id, permission_id)
			VALUES ($1, $2)
			ON CONFLICT DO NOTHING
		`, superAdminRoleID, pID)
	}

	// 3. Seed Superadmin User
	adminPassHash, _ := hasher.GenerateHash("AdminLocalhost2026!", nil)
	var adminUserID uuid.UUID
	_ = pool.QueryRow(ctx, `
		INSERT INTO users (email, password_hash, full_name, status)
		VALUES ('admin@localhost.co.th', $1, 'Lohakit Administrator', 'ACTIVE')
		ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
		RETURNING id
	`, adminPassHash).Scan(&adminUserID)

	_, _ = pool.Exec(ctx, `
		INSERT INTO user_roles (user_id, role_id)
		VALUES ($1, $2)
		ON CONFLICT DO NOTHING
	`, adminUserID, superAdminRoleID)

	// 4. Seed Themes (DARK, LIGHT, MODERN)
	darkTokens := json.RawMessage(`{
		"background": "#0B0F19",
		"surface": "#111827",
		"surfaceSecondary": "#1F2937",
		"text": "#F9FAFB",
		"textSecondary": "#9CA3AF",
		"primary": "#3B82F6",
		"secondary": "#6366F1",
		"accent": "#F59E0B",
		"border": "#374151",
		"shadow": "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
		"heroOverlay": "rgba(11, 15, 25, 0.85)",
		"cardStyle": "glassmorphism",
		"buttonStyle": "glow",
		"radius": "12px",
		"typography": "Inter, 'Kanit', sans-serif"
	}`)

	lightTokens := json.RawMessage(`{
		"background": "#F8FAFC",
		"surface": "#FFFFFF",
		"surfaceSecondary": "#F1F5F9",
		"text": "#0F172A",
		"textSecondary": "#475569",
		"primary": "#1E40AF",
		"secondary": "#0284C7",
		"accent": "#D97706",
		"border": "#E2E8F0",
		"shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
		"heroOverlay": "rgba(15, 23, 42, 0.65)",
		"cardStyle": "elevated",
		"buttonStyle": "solid",
		"radius": "8px",
		"typography": "Inter, 'Kanit', sans-serif"
	}`)

	modernTokens := json.RawMessage(`{
		"background": "#090D16",
		"surface": "rgba(20, 27, 45, 0.8)",
		"surfaceSecondary": "rgba(30, 41, 69, 0.6)",
		"text": "#FFFFFF",
		"textSecondary": "#A0ABC0",
		"primary": "#00E5FF",
		"secondary": "#7C3AED",
		"accent": "#FF007A",
		"border": "rgba(0, 229, 255, 0.2)",
		"shadow": "0 20px 40px rgba(0, 229, 255, 0.15)",
		"heroOverlay": "linear-gradient(180deg, rgba(9,13,22,0.7) 0%, rgba(9,13,22,0.95) 100%)",
		"cardStyle": "frosted-cyber",
		"buttonStyle": "neon-gradient",
		"radius": "16px",
		"typography": "Outfit, 'Kanit', sans-serif"
	}`)

	settingsSvc := service.NewSettingsService(queries)
	_, _ = settingsSvc.UpsertTheme(ctx, "DARK", "Industrial Dark Steel", false, darkTokens)
	_, _ = settingsSvc.UpsertTheme(ctx, "LIGHT", "Corporate Clean White", false, lightTokens)
	_, _ = settingsSvc.UpsertTheme(ctx, "MODERN", "Modern Cyber Metal", true, modernTokens) // active

	// 5. Seed Site Settings
	companyInfo := json.RawMessage(`{
		"nameTh": "บริษัท ไคโอทรอน เทคโนโลยี จำกัด",
		"nameEn": "CHIOTRON TECHNOLOGY CO., LTD.",
		"taxId": "0745548001234",
		"establishedYear": 1998,
		"registeredCapital": "100,000,000 THB",
		"factoryAreaSqM": 25000,
		"annualCapacityUnits": "120,000,000"
	}`)
	_, _ = settingsSvc.Upsert(ctx, "company", "company_profile", companyInfo, true, "Corporate profile and factory capabilities", adminUserID)

	contactInfo := json.RawMessage(`{
		"addressTh": "88 หมู่ 3 ถนนเศรษฐกิจ 1 ตำบลคลองมะเดื่อ อำเภอกระทุ่มแบน จังหวัดสมุทรสาคร 74110",
		"addressEn": "88 Moo 3, Setthakit 1 Rd, Khlong Maduea, Krathum Baen, Samut Sakhon 74110 Thailand",
		"phone": "+66 (0) 34 878 999",
		"fax": "+66 (0) 34 878 998",
		"email": "sales@lohakit.co.th",
		"businessHours": "Mon - Sat: 08:00 - 17:00",
		"googleMapsUrl": "https://maps.google.com/?q=13.6265,100.2642"
	}`)
	_, _ = settingsSvc.Upsert(ctx, "contact", "contact_details", contactInfo, true, "Contact information and factory coordinates", adminUserID)

	// 6. Seed Product Categories (4 Categories with 5-Language Translations)
	productSvc := service.NewProductService(queries, nil)

	catFood, _ := productSvc.CreateCategory(ctx, "food-beverage-cans", 1, []domain.ProductCategoryTranslation{
		{LanguageCode: "th", Name: "กระป๋องบรรจุอาหารและเครื่องดื่ม", Description: "บรรจุภัณฑ์โลหะเกรดอาหาร ปลอดภัย ปราศจากสาร BPA เคลือบป้องกันการกัดกร่อน"},
		{LanguageCode: "en", Name: "Food & Beverage Cans", Description: "Food-grade tinplate containers, BPA-NI certified with corrosion protection"},
		{LanguageCode: "cn", Name: "食品与饮料金属罐", Description: "食品级马口铁包装，BPA-NI无双酚A认证，高耐腐蚀防锈涂层"},
		{LanguageCode: "mm", Name: "အစားအသောက်နှင့် အဖျော်ယမကာ သံဗူးများ", Description: "BPA-NI လက်မှတ်ရ အစားအသောက်တန်း သံဗူးထုတ်ကုန်များ"},
		{LanguageCode: "jp", Name: "食品・飲料用スチール缶", Description: "BPA-NI認証取得の高品質食品グレードブリキ缶・高耐食性"},
	})

	catChemical, _ := productSvc.CreateCategory(ctx, "chemical-paint-pails", 2, []domain.ProductCategoryTranslation{
		{LanguageCode: "th", Name: "ถังโลหะบรรจุเคมีภัณฑ์และสี", Description: "ถังเหล็กบรรจุสารเคมี สี และน้ำมันหล่อลื่น แข็งแกร่ง ทนทานต่อแรงดันและสารละลาย"},
		{LanguageCode: "en", Name: "Chemical & Paint Pails", Description: "Heavy-duty industrial metal drums and pails for solvents, paints, and lubricants"},
		{LanguageCode: "cn", Name: "化工与涂料金属桶", Description: "适用于涂料、溶剂、润滑油的重型工业金属桶与开口桶"},
		{LanguageCode: "mm", Name: "ဓာတုဗေဒနှင့် ဆေးသုတ်ပုံးများ", Description: "စက်မှုလုပ်ငန်းသုံး သံပုံးများနှင့် ဓာတုဗေဒပုံးများ"},
		{LanguageCode: "jp", Name: "化学品・塗料用ペール缶", Description: "溶剤・塗料・潤滑油向けの高耐久性工業用ペール缶"},
	})

	catAerosol, _ := productSvc.CreateCategory(ctx, "aerosol-spray-cans", 3, []domain.ProductCategoryTranslation{
		{LanguageCode: "th", Name: "กระป๋องสเปรย์และแอโรซอล", Description: "กระป๋องอัดก๊าซทนแรงดันสูง สำหรับผลิตภัณฑ์ดูแลรถยนต์และของใช้ในบ้าน"},
		{LanguageCode: "en", Name: "Aerosol & Spray Cans", Description: "High-pressure resistant 3-piece aerosol cans for automotive and technical sprays"},
		{LanguageCode: "cn", Name: "气雾剂与喷雾罐", Description: "高耐压三片式气雾罐，适用于汽车养护与工业喷雾"},
		{LanguageCode: "mm", Name: "စပရေးသံဗူးများ", Description: "ဖိအားဒဏ်ခံနိုင်သော စပရေးသံဗူးထုတ်ကုန်များ"},
		{LanguageCode: "jp", Name: "エアゾール・スプレー缶", Description: "高耐圧3ピースエアゾール缶・自動車および工業用途"},
	})

	catClosures, _ := productSvc.CreateCategory(ctx, "metal-closures-lids", 4, []domain.ProductCategoryTranslation{
		{LanguageCode: "th", Name: "ฝาโลหะและฝาดึงง่าย (EOE)", Description: "ฝาเปิดง่าย Easy Open End, ฝากระป๋องสี, ฝาเกลียว และฝาล็อคคุณภาพสูง"},
		{LanguageCode: "en", Name: "Metal Closures & Lids", Description: "Easy Open Ends (EOE), paint can ring/lids, and specialized metal closures"},
		{LanguageCode: "cn", Name: "金属盖与易拉盖", Description: "易拉盖（EOE）、涂料罐环盖组合以及精密金属封口盖"},
		{LanguageCode: "mm", Name: "သံဗူးအဖုံးများနှင့် လွယ်ကူစွာဖွင့်နိုင်သောအဖုံးများ", Description: "အရည်အသွေးမြင့် သံဗူးအဖုံးများနှင့် Easy Open End များ"},
		{LanguageCode: "jp", Name: "金属キャップ・イージーオープン蓋", Description: "イージーオープンエンド（EOE）、塗料缶蓋および精密金属クロージャー"},
	})

	// 7. Seed Products
	if catFood != nil {
		_, _ = productSvc.CreateProduct(ctx, service.CreateProductParams{
			CategoryID: catFood.ID,
			SKU:        "LK-CAN-300-401",
			Status:     "PUBLISHED",
			Specifications: json.RawMessage(`{
				"diameter_mm": 73.0,
				"height_mm": 105.0,
				"volume_ml": 425,
				"material": "ETP Tinplate 0.20mm",
				"internal_lacquer": "Gold Epoxy BPA-NI",
				"external_coating": "Clear Varnish / 6-Color Offset Printing",
				"seaming_type": "Sanitary Double Seam"
			}`),
			SortOrder: 1,
			CreatedBy: adminUserID,
			Translations: []domain.ProductTranslation{
				{
					LanguageCode:    "th",
					Name:            "กระป๋องอาหารสำเร็จรูป ขนาดมาตรฐาน 300x401",
					Slug:            "standard-food-can-300x401",
					Description:     "กระป๋องโลหะ 3 ชิ้นเกรดพรีเมียม เคลือบแล็กเกอร์ฟู้ดเกรด ปลอดสารก่อมะเร็ง เหมาะสำหรับปลากระป๋อง ผลไม้แปรรูป และซอส",
					Features:        "ทนความร้อนสูงในการสเตอริไลซ์, ป้องกันแสงและออกซิเจน 100%, พิมพ์ลายความละเอียดสูง",
					Applications:    "อาหารกระป๋อง, ปลากระป๋อง, ผลไม้กระป๋อง, ผักดอง, ซอสปรุงรส",
					Material:        "Tinplate ETP (Electrolytic Tinplate)",
					CoatingType:     "BPA-NI Gold Epoxy",
					MetaTitle:       "กระป๋องอาหาร 300x401 คุณภาพมาตรฐานสากล | โลหะกิจรุ่งเจริญทรัพย์",
					MetaDescription: "โรงงานผลิตกระป๋องอาหาร มาตรฐานส่งออก ปลอดภัย BPA-NI รองรับการสเตอริไลซ์",
				},
				{
					LanguageCode:    "en",
					Name:            "Standard Food Can Size 300x401",
					Slug:            "standard-food-can-300x401-en",
					Description:     "Premium 3-piece tinplate container with BPA-NI certified interior lacquer. Suitable for canned tuna, processed fruits, and sauces.",
					Features:        "High sterilization heat resistance, 100% barrier against oxygen and UV, up to 6-color offset printing",
					Applications:    "Canned seafood, fruits, vegetables, tomato paste, ready meals",
					Material:        "Electrolytic Tinplate (ETP)",
					CoatingType:     "BPA-NI Epoxy",
					MetaTitle:       "Food Can 300x401 Manufacturer | CHIOTRON TECHNOLOGY",
					MetaDescription: "Export-grade metal food can packaging with certified BPA-NI food safety standards.",
				},
				{
					LanguageCode:    "cn",
					Name:            "标准食品罐 300x401",
					Slug:            "standard-food-can-300x401-cn",
					Description:     "高品质三片式马口铁食品罐，符合国际BPA-NI安全标准，适用于金枪鱼、果蔬罐头及调味酱料。",
					Features:        "耐高温高压杀菌、高密封抗氧化阻隔、6色精密胶印",
					Applications:    "海鲜罐头、水果罐头、蔬菜罐头、番茄酱、即食食品",
					Material:        "电镀锡马口铁 (ETP)",
					CoatingType:     "无双酚A金黄内涂",
					MetaTitle:       "标准食品马口铁罐 300x401 制造厂 | 罗汉吉金属制造",
					MetaDescription: "泰国专业食品金属罐制造厂，符合国际出口卫生与安全标准。",
				},
				{
					LanguageCode:    "mm",
					Name:            "စံချိန်မီ အစားအသောက်သံဗူး 300x401",
					Slug:            "standard-food-can-300x401-mm",
					Description:     "BPA-NI အဆင့်မြင့် အစားအသောက်တန်း သံဗူး ထုတ်ကုန်။ ငါးသေတ္တာနှင့် သစ်သီးယိုများအတွက် အထူးသင့်လျော်သည်။",
					Features:        "အပူချိန်မြင့်မားစွာ သန့်စင်နိုင်ခြင်း၊ လေလုံမှု ၁၀၀%",
					Applications:    "ငါးသေတ္တာ၊ သစ်သီးယို၊ ဟင်းသီးဟင်းရွက်ဘူးများ",
					Material:        "ETP သံပြား",
					CoatingType:     "BPA-NI အလွှာ",
					MetaTitle:       "အစားအသောက်သံဗူး 300x401 ထုတ်လုပ်သူ | Lohakit",
					MetaDescription: "နိုင်ငံတကာအဆင့်မီ သံဗူးထုတ်လုပ်ရေးစက်ရုံ။",
				},
				{
					LanguageCode:    "jp",
					Name:            "標準食品用スチール缶 300x401",
					Slug:            "standard-food-can-300x401-jp",
					Description:     "BPA-NI規格適合の3ピースブリキ食品缶。水産缶詰、果実・野菜加工品に最適。",
					Features:        "高耐熱レトルト殺菌対応、完全遮光・酸素バリア、高精細6色オフセット印刷",
					Applications:    "水産缶詰、果物缶詰、トマトペースト、レトルト食品",
					Material:        "電気ブリキ鋼板 (ETP)",
					CoatingType:     "BPA-NI エポキシコーティング",
					MetaTitle:       "食品用ブリキ缶 300x401 製造メーカー | CHIOTRON TECHNOLOGY",
					MetaDescription: "輸出向け食品安全基準をクリアしたタイの金属包装製造メーカー。",
				},
			},
		})
	}

	if catChemical != nil {
		_, _ = productSvc.CreateProduct(ctx, service.CreateProductParams{
			CategoryID: catChemical.ID,
			SKU:        "LK-PAIL-20L-IND",
			Status:     "PUBLISHED",
			Specifications: json.RawMessage(`{
				"capacity_liters": 20,
				"diameter_top_mm": 298.0,
				"diameter_bottom_mm": 275.0,
				"height_mm": 370.0,
				"thickness_mm": 0.38,
				"closure": "Lug Cover / Lever Lock Ring with Gasket",
				"handle": "Steel Wire with Plastic Grip",
				"un_certification": "UN 1A2/Y1.4/100"
			}`),
			SortOrder: 2,
			CreatedBy: adminUserID,
			Translations: []domain.ProductTranslation{
				{
					LanguageCode:    "th",
					Name:            "ถังโลหะบรรจุเคมีภัณฑ์ ขนาด 20 ลิตร (UN Certified)",
					Slug:            "industrial-chemical-pail-20l",
					Description:     "ถังเหล็กทรงสอบขนาด 20 ลิตร ฝาล็อคคันโยก มาตรฐาน UN สำหรับบรรจุสารเคมี ทินเนอร์ สีน้ำมัน และน้ำมันเครื่อง",
					Features:        "มาตรฐาน UN สำหรับการขนส่งสารอันตราย, ซีลกันรั่วซึมสองชั้น, ทนการกัดกร่อนจากตัวทำละลาย",
					Applications:    "สีอุตสาหกรรม, กาว, เคมีเกษตร, ตัวทำละลาย, น้ำมันหล่อลื่น",
					Material:        "แผ่นเหล็กกล้าเคลือบดีบุก / เหล็กดำเคลือบกันสนิม",
					CoatingType:     "Phenolic Lacquer ทนเคมีเข้มข้น",
					MetaTitle:       "ถังเคมี 20 ลิตร ฝาล็อคคันโยก มาตรฐาน UN | โลหะกิจรุ่งเจริญทรัพย์",
					MetaDescription: "โรงงานผลิตถังโลหะ 20 ลิตร คุณภาพสูง ทนแรงกระแทก มาตรฐานขนส่งสารเคมีสากล",
				},
				{
					LanguageCode:    "en",
					Name:            "20-Liter Industrial Chemical Metal Pail (UN Certified)",
					Slug:            "industrial-chemical-pail-20l-en",
					Description:     "Heavy-duty tapered steel pail with lever lock ring lid. Certified for transport of dangerous chemicals and solvents.",
					Features:        "UN certified for hazardous goods, airtight rubber gasket seal, heavy-gauge steel construction",
					Applications:    "Industrial paints, coatings, adhesives, solvents, lubricants, agrochemicals",
					Material:        "Heavy-gauge Steel / Tinplate",
					CoatingType:     "Chemical Resistant Phenolic Lining",
					MetaTitle:       "20L Metal Chemical Pail UN Certified | CHIOTRON TECHNOLOGY",
					MetaDescription: "Industrial steel drum and pail manufacturer with certified UN ratings for export.",
				},
				{
					LanguageCode:    "cn",
					Name:            "20升工业化工金属桶 (UN认证)",
					Slug:            "industrial-chemical-pail-20l-cn",
					Description:     "20升重型开口钢桶，配备杠杆锁紧环。获得UN联合国危险品国际运输包装认证。",
					Features:        "UN国际危险品认证、强力气密密封圈、耐强溶剂内衬",
					Applications:    "工业油漆、树脂、农化、稀释剂、润滑油",
					Material:        "重规优质冷轧钢/马口铁",
					CoatingType:     "耐腐蚀酚醛内涂层",
					MetaTitle:       "20升化工钢桶 UN认证制造厂 | 罗汉吉金属制造",
					MetaDescription: "专业制造20升化工开口钢桶与闭口桶，通过UN国际危险品包装标准。",
				},
				{
					LanguageCode:    "mm",
					Name:            "၂၀ လီတာ စက်မှုလုပ်ငန်းသုံး သံပုံး (UN လက်မှတ်ရ)",
					Slug:            "industrial-chemical-pail-20l-mm",
					Description:     "အန္တရာယ်ရှိသော ဓာတုဗေဒပစ္စည်းများ ထည့်သွင်းရန် UN လက်မှတ်ရ ၂၀ လီတာ သံပုံး။",
					Features:        "UN လက်မှတ်ရ၊ ယိုစိမ့်မှု လုံးဝမရှိသော သံပုံး",
					Applications:    "ဆေးသုတ်ဆီ၊ ကော်၊ စက်ဆီ၊ ဓာတုပစ္စည်းများ",
					Material:        "သံမဏိပြား",
					CoatingType:     "ဓာတုဒဏ်ခံ အလွှာ",
					MetaTitle:       "၂၀ လီတာ သံပုံး ထုတ်လုပ်သူ | Lohakit",
					MetaDescription: "စက်မှုလုပ်ငန်းသုံး သံပုံးထုတ်လုပ်ရေးစက်ရုံ။",
				},
				{
					LanguageCode:    "jp",
					Name:            "20L 工業用ケミカルペール缶 (UN規格取得)",
					Slug:            "industrial-chemical-pail-20l-jp",
					Description:     "UN規格取得の20Lテーパー型スチールペール缶。溶剤、危険物、塗料の安全な保管と輸送に最適。",
					Features:        "UN危険物輸送基準クリア、高性能ガスケットによる完全密閉、高耐溶剤フェノール内面塗装",
					Applications:    "工業用塗料、接着剤、農薬、シンナー、工業用オイル",
					Material:        "冷間圧延鋼板 / ブリキ",
					CoatingType:     "耐薬品性フェノールライニング",
					MetaTitle:       "20L UN規格スチールペール缶製造 | CHIOTRON TECHNOLOGY",
					MetaDescription: "危険物輸送用UN認証を取得した高品質工業用ペール缶製造メーカー。",
				},
			},
		})
	}

	if catAerosol != nil {
		_, _ = productSvc.CreateProduct(ctx, service.CreateProductParams{
			CategoryID: catAerosol.ID,
			SKU:        "LK-AERO-65X190",
			Status:     "PUBLISHED",
			Specifications: json.RawMessage(`{
				"diameter_mm": 65.0,
				"height_mm": 190.0,
				"volume_ml": 500,
				"pressure_resistance_bar": 15,
				"valve_opening_inch": "1 inch",
				"bottom_type": "Dome / Concave high pressure"
			}`),
			SortOrder: 3,
			CreatedBy: adminUserID,
			Translations: []domain.ProductTranslation{
				{
					LanguageCode: "th",
					Name:         "กระป๋องสเปรย์ทนแรงดันสูง 65x190 มม.",
					Slug:         "aerosol-can-65x190",
					Description:  "กระป๋องสเปรย์ 3 ชิ้น คุณภาพสูง ทนแรงดันได้ถึง 15 บาร์ เหมาะสำหรับสเปรย์สี สเปรย์หล่อลื่น และผลิตภัณฑ์คาร์แคร์",
					Applications: "สีสเปรย์, สเปรย์ล้างเบรค, น้ำมันหล่อลื่นอเนกประสงค์, สเปรย์ปรับอากาศ",
					Material:     "Tinplate (ETP)",
					CoatingType:  "Clear Lacquer",
				},
				{
					LanguageCode: "en",
					Name:         "High Pressure Aerosol Can 65x190mm",
					Slug:         "aerosol-can-65x190-en",
					Description:  "High-strength 3-piece aerosol tinplate can with 15 bar burst pressure resistance for automotive and industrial sprays.",
					Applications: "Spray paint, brake cleaners, lubricants, air fresheners",
					Material:     "Electrolytic Tinplate",
					CoatingType:  "Clear Lacquer",
				},
			},
		})
	}

	if catClosures != nil {
		_, _ = productSvc.CreateProduct(ctx, service.CreateProductParams{
			CategoryID: catClosures.ID,
			SKU:        "LK-EOE-300-FS",
			Status:     "PUBLISHED",
			Specifications: json.RawMessage(`{
				"diameter_mm": 73.0,
				"opening_type": "Full Aperture / Easy Open End (EOE)",
				"compound_gasket": "Food-grade PVC Free",
				"tab_type": "Ring Pull / Stay On Tab"
			}`),
			SortOrder: 4,
			CreatedBy: adminUserID,
			Translations: []domain.ProductTranslation{
				{
					LanguageCode: "th",
					Name:         "ฝาดึงเปิดง่าย Easy Open End (EOE) ขนาด 300",
					Slug:         "easy-open-end-300",
					Description:  "ฝาเปิดง่าย EOE สำหรับกระป๋องอาหาร เปิดลื่น ดึงง่าย ไม่บาดมือ ปลอดสาร BPA-NI",
					Applications: "ปลากระป๋อง, ผลไม้กระป๋อง, อาหารสัตว์เลี้ยง",
					Material:     "Tinplate / Aluminum Tab",
					CoatingType:  "Food Grade Gold Epoxy",
				},
				{
					LanguageCode: "en",
					Name:         "Easy Open End (EOE) Lid Size 300",
					Slug:         "easy-open-end-300-en",
					Description:  "Smooth-pull full aperture Easy Open End closure with BPA-NI food contact compliance.",
					Applications: "Canned tuna, fruits, pet food",
					Material:     "Tinplate / Aluminum",
					CoatingType:  "BPA-NI Gold Epoxy",
				},
			},
		})
	}

	// 8. Seed Homepage Page Builder Sections
	pageSvc := service.NewPageService(queries)
	homePage, err := pageSvc.CreatePage(ctx, service.CreatePageParams{
		Slug:      "home",
		Status:    "PUBLISHED",
		CreatedBy: adminUserID,
		Translations: []domain.PageTranslation{
			{
				LanguageCode:    "th",
				Title:           "ผู้นำด้านบรรจุภัณฑ์โลหะและกระป๋องคุณภาพสูงระดับสากล",
				MetaTitle:       "บริษัท ไคโอทรอน เทคโนโลยี จำกัด | โรงงานผลิตกระป๋องและบรรจุภัณฑ์โลหะชั้นนำ",
				MetaDescription: "โรงงานผลิตบรรจุภัณฑ์โลหะ กระป๋องอาหาร ถังเคมี ฝาโลหะ คุณภาพมาตรฐานสากล ด้วยเทคโนโลยีทันสมัยและเป็นมิตรต่อสิ่งแวดล้อม",
				MetaKeywords:    "กระป๋องอาหาร, ถังโลหะ, บรรจุภัณฑ์โลหะ, ฝากระป๋อง, โลหะกิจรุ่งเจริญทรัพย์, Lohakit",
			},
			{
				LanguageCode:    "en",
				Title:           "Global Leader in Premium Metal Packaging Solutions",
				MetaTitle:       "CHIOTRON TECHNOLOGY CO., LTD. | Advanced Metal Packaging Manufacturer",
				MetaDescription: "Leading manufacturer of food cans, chemical pails, aerosol cans, and easy-open ends in Thailand with international export standards.",
				MetaKeywords:    "metal packaging, food cans, tinplate, aerosol cans, steel drums, Lohakit",
			},
			{
				LanguageCode:    "cn",
				Title:           "全球领先的优质金属包装解决方案制造商",
				MetaTitle:       "罗汉吉金属制造有限公司 | 泰国领先的金属包装与马口铁罐制造厂",
				MetaDescription: "专业生产高品质食品罐、化工桶、气雾罐与易拉盖，通过国际ISO与BPA-NI认证，出口全球各大市场。",
				MetaKeywords:    "金属包装, 马口铁罐, 食品罐, 化工桶, 气雾罐, 易拉盖, 罗汉吉",
			},
			{
				LanguageCode:    "mm",
				Title:           "ထိပ်တန်း သံဗူးနှင့် သတ္တုထုပ်ပိုးပစ္စည်းများ ထုတ်လုပ်ရေး",
				MetaTitle:       "CHIOTRON TECHNOLOGY CO., LTD. | သံဗူးနှင့် သတ္တုထုပ်ပိုးပစ္စည်း ထုတ်လုပ်ရေးစက်ရုံ",
				MetaDescription: "အစားအသောက်သံဗူးများ၊ ဓာတုဗေဒသံပုံးများနှင့် သတ္ตုအဖုံးများကို နိုင်ငံတကာအဆင့်မီ ထုတ်လုပ်ပေးနေပါသည်။",
				MetaKeywords:    "သံဗူး, သတ္တုထုပ်ပိုးမှု, စက်မှုလုပ်ငန်းသုံးသံပုံး, Lohakit",
			},
			{
				LanguageCode:    "jp",
				Title:           "高品質金属包装・スチール缶ソリューションのグローバルリーダー",
				MetaTitle:       "CHIOTRON TECHNOLOGY CO., LTD. | 金属包装・スチール缶総合メーカー",
				MetaDescription: "食品用缶、化学品用ペール缶、エアゾール缶、イージーオープン蓋の専門メーカー。国際基準の品質管理と環境配慮型製造。",
				MetaKeywords:    "金属包装, ブリキ缶, ペール缶, エアゾール缶, イージーオープンエンド, Lohakit",
			},
		},
	})

	if homePage != nil {
		// Section 1: Hero
		_, _ = pageSvc.AddSection(ctx, homePage.ID, "hero", 1, json.RawMessage(`{
			"badge": "ISO 9001:2015 & FSSC 22000 Certified",
			"ctaPrimary": {"text": "Explore Catalog", "link": "/products"},
			"ctaSecondary": {"text": "Contact Engineers", "link": "/contact"},
			"videoBackground": false
		}`), []domain.PageSectionTranslation{
			{
				LanguageCode: "th",
				Title:        "นวัตกรรมบรรจุภัณฑ์โลหะที่แข็งแกร่ง ปลอดภัย และยั่งยืน",
				Subtitle:     "บริษัท ไคโอทรอน เทคโนโลยี จำกัด ผลิตกระป๋องอาหาร ถังเคมีภัณฑ์ และฝาโลหะมาตรฐานส่งออก ด้วยเครื่องจักรอัตโนมัติความเร็วสูง",
				ContentBody:  "กว่า 25 ปีแห่งความเชี่ยวชาญในการส่งมอบบรรจุภัณฑ์โลหะมาตรฐานสากลให้แก่แบรนด์ชั้นนำทั่วโลก",
			},
			{
				LanguageCode: "en",
				Title:        "Engineered Metal Packaging for Maximum Strength, Safety & Sustainability",
				Subtitle:     "CHIOTRON TECHNOLOGY manufactures export-grade food cans, chemical pails, and metal closures with high-speed automated lines.",
				ContentBody:  "Over 25 years of engineering excellence delivering trusted metal packaging solutions worldwide.",
			},
			{
				LanguageCode: "cn",
				Title:        "精工智造 卓越安全 可持续金属包装解决方案",
				Subtitle:     "罗汉吉金属制造拥有全自动高速生产线，专业为全球客户定制食品罐、化工桶与高精度金属封口盖。",
				ContentBody:  "逾25年精密制造经验，为全球各大食品及工业品牌提供高标准包装保障。",
			},
			{
				LanguageCode: "mm",
				Title:        "ခိုင်ခံ့မှု၊ ဘေးကင်းမှုနှင့် ရေရှည်တည်တံ့မှုရှိသော သတ္တုထုပ်ပိုးမှုများ",
				Subtitle:     "အလိုအလျောက် အဆင့်မြင့်စက်ယန္တရားများဖြင့် နိုင်ငံတကာအဆင့်မီ သံဗူးထုတ်ကုန်များကို ထုတ်လုပ်လျက်ရှိပါသည်။",
				ContentBody:  "နှစ်ပေါင်း ၂၅ ကျော် အတွေ့အကြုံဖြင့် ကမ္ဘာ့အဆင့်မီ ထုတ်ကုန်များကို ပေးအပ်လျက်ရှိသည်။",
			},
			{
				LanguageCode: "jp",
				Title:        "最高水準の強度、安全性、環境適合性を兼ね備えた金属包装ソリューション",
				Subtitle:     "ロハキット社は最新鋭の高速全自動ラインにより、輸出規格の食品缶、工業用ペール缶、精密クロージャーを製造しています。",
				ContentBody:  "25年以上にわたる技術の蓄積により、世界のトップブランドから信頼されるパートナー。",
			},
		})

		// Section 2: Key Statistics
		_, _ = pageSvc.AddSection(ctx, homePage.ID, "statistics", 2, json.RawMessage(`{
			"metrics": [
				{"value": "120M+", "label": "Annual Capacity (Units)"},
				{"value": "25,000", "label": "Factory Area (Sq.M)"},
				{"value": "25+", "label": "Years Experience"},
				{"value": "99.98%", "label": "Quality Pass Rate"}
			]
		}`), []domain.PageSectionTranslation{
			{
				LanguageCode: "th",
				Title:        "ศักยภาพการผลิตและมาตรฐานความเป็นเลิศ",
				Subtitle:     "ตัวเลขที่สะท้อนถึงความไว้วางใจและกำลังการผลิตระดับอุตสาหกรรม",
			},
			{
				LanguageCode: "en",
				Title:        "Manufacturing Scale & Proven Excellence",
				Subtitle:     "Key indicators reflecting industrial capability and client trust globally",
			},
			{
				LanguageCode: "cn",
				Title:        "雄厚产能与卓越品质认证",
				Subtitle:     "数字印证实力，全球客户信赖的工业制造标杆",
			},
			{
				LanguageCode: "mm",
				Title:        "ထုတ်လုပ်မှုစွမ်းရည်နှင့် စံချိန်စံညွှန်းများ",
				Subtitle:     "ကမ္ဘာတစ်ဝှမ်းမှ ယုံကြည်စိတ်ချရသော ထုတ်လုပ်မှုကိန်းဂဏန်းများ",
			},
			{
				LanguageCode: "jp",
				Title:        "圧倒的な生産能力と確かな品質実績",
				Subtitle:     "グローバル市場で信頼される製造規模と数値実績",
			},
		})

		// Section 3: Feature Highlights
		_, _ = pageSvc.AddSection(ctx, homePage.ID, "feature_cards", 3, json.RawMessage(`{
			"columns": 3,
			"items": [
				{"icon": "shield-check", "key": "food_safety"},
				{"icon": "recycle", "key": "sustainability"},
				{"icon": "cpu", "key": "automation"}
			]
		}`), []domain.PageSectionTranslation{
			{
				LanguageCode: "th",
				Title:        "จุดเด่นที่ทำให้เราเป็นที่หนึ่งในใจลูกค้า",
				Subtitle:     "ความปลอดภัยเกรดอาหาร 100%, โลหะรีไซเคิลได้ไม่รู้จบ, เทคโนโลยีอัตโนมัติขั้นสูง",
			},
			{
				LanguageCode: "en",
				Title:        "Why Leading Manufacturers Choose Lohakit",
				Subtitle:     "100% Certified Food Safety, Infinitely Recyclable Metal, Advanced Automated Quality Control",
			},
			{
				LanguageCode: "cn",
				Title:        "领先制造业选择罗汉吉的核心优势",
				Subtitle:     "100% 食品安全保证、无限次循环再生环保金属、全自动智能视觉质检",
			},
			{
				LanguageCode: "mm",
				Title:        "Lohakit ကို ရွေးချယ်သင့်သော အဓိကအချက်များ",
				Subtitle:     "အစားအသောက် ဘေးကင်းမှု ၁၀၀%၊ သဘာဝပတ်ဝန်းကျင် ထိန်းသိမ်းရေး၊ အဆင့်မြင့် စက်မှုနည်းပညာ",
			},
			{
				LanguageCode: "jp",
				Title:        "世界のトップメーカーから選ばれる理由",
				Subtitle:     "100%食品安全認証、無限にリサイクル可能な金属資源、全自動画像検査による徹底した品質管理",
			},
		})

		// Publish home page
		_, _ = pageSvc.PublishPage(ctx, homePage.ID, adminUserID)
	}

	fmt.Println("Database seed completed successfully!")
	fmt.Println("Admin Login:")
	fmt.Println("  Email:    admin@localhost.co.th")
	fmt.Println("  Password: AdminLocalhost2026!")
}
