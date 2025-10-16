/**
 * Script tự động cập nhật SRS.md
 * Quét codebase để tìm các công thức tính toán mới và cập nhật tài liệu
 */

const fs = require("fs");
const path = require("path");

class SRSUpdater {
  constructor() {
    this.srsPath = path.join(__dirname, "SRS .md");
    this.jsFiles = [
      "assets/js/main.js",
      "assets/js/charts.js",
      "assets/js/dynamic-revenue.js",
      "assets/js/sales-target-analytics.js",
      "assets/js/revenue-data-sync.js",
      "assets/js/filter-handler.js",
      "aws-lambda-integration.js",
    ];
    this.formulas = new Map();
    this.lastUpdate = new Date().toISOString();
  }

  /**
   * Quét tất cả file JS để tìm công thức tính toán
   */
  scanCodebase() {
    console.log("🔍 Đang quét codebase để tìm công thức tính toán...");

    this.jsFiles.forEach((filePath) => {
      const fullPath = path.join(__dirname, filePath);
      if (fs.existsSync(fullPath)) {
        this.scanFile(fullPath);
      } else {
        console.log(`⚠️  File không tồn tại: ${filePath}`);
      }
    });

    console.log(`✅ Đã quét ${this.formulas.size} công thức tính toán`);
  }

  /**
   * Quét một file để tìm công thức
   */
  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        const lineNumber = index + 1;

        // Tìm các pattern công thức tính toán
        this.findFormulas(line, filePath, lineNumber);
      });
    } catch (error) {
      console.error(`❌ Lỗi đọc file ${filePath}:`, error.message);
    }
  }

  /**
   * Tìm các công thức trong một dòng code
   */
  findFormulas(line, filePath, lineNumber) {
    const patterns = [
      // Tỉ lệ phần trăm
      {
        pattern: /(\w+)\s*=\s*Math\.round\(\([^)]+\)\s*\*\s*100\)/,
        type: "percentage",
      },
      { pattern: /(\w+)\s*=\s*\([^)]+\)\s*\*\s*100/, type: "percentage" },

      // Phép chia
      {
        pattern: /(\w+)\s*=\s*Math\.round\([^/]+\s*\/\s*[^)]+\)/,
        type: "division",
      },
      { pattern: /(\w+)\s*=\s*[^/]+\s*\/\s*[^;]+/, type: "division" },

      // Phép nhân
      { pattern: /(\w+)\s*=\s*[^*]+\s*\*\s*[^;]+/, type: "multiplication" },

      // Phép trừ
      { pattern: /(\w+)\s*=\s*[^-]+\s*-\s*[^;]+/, type: "subtraction" },

      // Phép cộng
      { pattern: /(\w+)\s*=\s*[^+]+\s*\+\s*[^;]+/, type: "addition" },

      // Filter multipliers
      { pattern: /(\w+):\s*(\d+\.?\d*)/, type: "multiplier" },

      // Date calculations
      { pattern: /new Date\([^)]+\)/, type: "date_calculation" },

      // Array operations
      { pattern: /\.filter\([^)]+\)/, type: "filter_operation" },
      { pattern: /\.map\([^)]+\)/, type: "map_operation" },
      { pattern: /\.reduce\([^)]+\)/, type: "reduce_operation" },
    ];

    patterns.forEach(({ pattern, type }) => {
      const matches = line.match(pattern);
      if (matches) {
        const formula = {
          type,
          code: line.trim(),
          file: path.basename(filePath),
          line: lineNumber,
          timestamp: new Date().toISOString(),
        };

        const key = `${filePath}:${lineNumber}`;
        this.formulas.set(key, formula);
      }
    });
  }

  /**
   * Tạo báo cáo cập nhật
   */
  generateUpdateReport() {
    const report = {
      lastUpdate: this.lastUpdate,
      totalFormulas: this.formulas.size,
      filesScanned: this.jsFiles.length,
      formulasByType: this.groupFormulasByType(),
      newFormulas: this.findNewFormulas(),
      updatedFiles: this.getUpdatedFiles(),
    };

    return report;
  }

  /**
   * Nhóm công thức theo loại
   */
  groupFormulasByType() {
    const groups = {};
    this.formulas.forEach((formula) => {
      if (!groups[formula.type]) {
        groups[formula.type] = [];
      }
      groups[formula.type].push(formula);
    });
    return groups;
  }

  /**
   * Tìm công thức mới (so với lần cập nhật trước)
   */
  findNewFormulas() {
    // Trong thực tế, sẽ so sánh với database hoặc file lưu trữ
    return Array.from(this.formulas.values()).filter(
      (f) => new Date(f.timestamp) > new Date(this.lastUpdate)
    );
  }

  /**
   * Lấy danh sách file đã cập nhật
   */
  getUpdatedFiles() {
    const files = new Set();
    this.formulas.forEach((formula) => {
      files.add(formula.file);
    });
    return Array.from(files);
  }

  /**
   * Cập nhật SRS.md với thông tin mới
   */
  updateSRS() {
    try {
      let srsContent = fs.readFileSync(this.srsPath, "utf8");

      // Thêm section cập nhật mới
      const updateSection = this.generateUpdateSection();

      // Tìm vị trí để chèn (trước phần cuối)
      const lastSectionIndex = srsContent.lastIndexOf("---");
      if (lastSectionIndex !== -1) {
        srsContent =
          srsContent.slice(0, lastSectionIndex) +
          updateSection +
          "\n\n" +
          srsContent.slice(lastSectionIndex);
      } else {
        srsContent += "\n\n" + updateSection;
      }

      // Ghi file
      fs.writeFileSync(this.srsPath, srsContent, "utf8");
      console.log("✅ Đã cập nhật SRS.md thành công");
    } catch (error) {
      console.error("❌ Lỗi cập nhật SRS.md:", error.message);
    }
  }

  /**
   * Tạo section cập nhật
   */
  generateUpdateSection() {
    const report = this.generateUpdateReport();

    return `
## 6. Cập nhật tự động - ${new Date().toLocaleDateString("vi-VN")}

### 6.1. Thống kê cập nhật
- **Thời gian cập nhật**: ${report.lastUpdate}
- **Tổng số công thức**: ${report.totalFormulas}
- **Số file đã quét**: ${report.filesScanned}
- **File đã cập nhật**: ${report.updatedFiles.join(", ")}

### 6.2. Công thức theo loại
${Object.entries(report.formulasByType)
  .map(
    ([type, formulas]) => `
#### ${type} (${formulas.length} công thức)
${formulas.map((f) => `- **${f.file}:${f.line}**: \`${f.code}\``).join("\n")}
`
  )
  .join("\n")}

### 6.3. Công thức mới
${
  report.newFormulas.length > 0
    ? report.newFormulas
        .map((f) => `- **${f.file}:${f.line}**: \`${f.code}\``)
        .join("\n")
    : "Không có công thức mới"
}

### 6.4. Hướng dẫn sử dụng script cập nhật
\`\`\`bash
# Chạy script cập nhật
node update-srs.js

# Hoặc với npm script (nếu có)
npm run update-srs
\`\`\`

**Lưu ý**: Script này sẽ tự động quét codebase và cập nhật tài liệu. Chạy script này mỗi khi có thay đổi về logic tính toán.
`;
  }

  /**
   * Chạy toàn bộ quy trình cập nhật
   */
  run() {
    console.log("🚀 Bắt đầu cập nhật SRS.md...");

    this.scanCodebase();
    this.updateSRS();

    const report = this.generateUpdateReport();
    console.log("\n📊 Báo cáo cập nhật:");
    console.log(`- Tổng số công thức: ${report.totalFormulas}`);
    console.log(`- File đã quét: ${report.filesScanned}`);
    console.log(`- Công thức mới: ${report.newFormulas.length}`);

    console.log("\n✅ Hoàn thành cập nhật SRS.md");
  }
}

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  const updater = new SRSUpdater();
  updater.run();
}

module.exports = SRSUpdater;


