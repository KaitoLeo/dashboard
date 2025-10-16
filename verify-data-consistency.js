// verify-data-consistency.js
// Script to verify data consistency in booking-yesterday-detail.html

const fs = require("fs");

function verifyBookingYesterdayConsistency() {
  console.log("🔍 Verifying Data Consistency for Booking Yesterday Detail...");

  try {
    const content = fs.readFileSync(
      "pages/03-05-01-03-booking-yesterday-detail.html",
      "utf8"
    );

    // Extract total check-in
    const totalMatch = content.match(
      /<h6>Tổng check-in Hôm qua<\/h6>[\s\S]*?<h3[^>]*>(\d+)<\/h3>/
    );
    const totalCheckins = totalMatch ? parseInt(totalMatch[1]) : 0;
    console.log(`📊 Total Check-ins: ${totalCheckins}`);

    // Extract service counts
    const serviceMatches = content.match(
      /<h6>(PT Fitness|Membership|Pilates|Swimming Coach)<\/h6>[\s\S]*?<h3[^>]*>(\d+)<\/h3>/g
    );
    const serviceCounts = {};
    let serviceSum = 0;

    if (serviceMatches) {
      serviceMatches.forEach((match) => {
        const serviceMatch = match.match(
          /<h6>(PT Fitness|Membership|Pilates|Swimming Coach)<\/h6>[\s\S]*?<h3[^>]*>(\d+)<\/h3>/
        );
        if (serviceMatch) {
          const service = serviceMatch[1];
          const count = parseInt(serviceMatch[2]);
          serviceCounts[service] = count;
          serviceSum += count;
        }
      });
    }

    console.log(`📊 Service Counts:`, serviceCounts);
    console.log(`📊 Service Sum: ${serviceSum}`);

    // Extract hourly breakdown
    const hourlyMatches = content.match(
      /<span class="badge bg-success">(\d+)<\/span>/g
    );
    const hourlyCounts = [];
    let hourlySum = 0;

    if (hourlyMatches) {
      hourlyMatches.forEach((match) => {
        const count = parseInt(match.match(/>(\d+)</)[1]);
        hourlyCounts.push(count);
        hourlySum += count;
      });
    }

    console.log(`📊 Hourly Breakdown:`, hourlyCounts);
    console.log(`📊 Hourly Sum: ${hourlySum}`);

    // Check consistency
    console.log("\n📊 CONSISTENCY CHECK:");
    console.log(`Total Check-ins: ${totalCheckins}`);
    console.log(`Service Sum: ${serviceSum}`);
    console.log(`Hourly Sum: ${hourlySum}`);

    const isConsistent =
      totalCheckins === serviceSum && totalCheckins === hourlySum;

    if (isConsistent) {
      console.log("✅ All data is consistent!");
    } else {
      console.log("❌ Data inconsistency detected!");
      if (totalCheckins !== serviceSum) {
        console.log(
          `❌ Total (${totalCheckins}) ≠ Service Sum (${serviceSum})`
        );
      }
      if (totalCheckins !== hourlySum) {
        console.log(`❌ Total (${totalCheckins}) ≠ Hourly Sum (${hourlySum})`);
      }
      if (serviceSum !== hourlySum) {
        console.log(
          `❌ Service Sum (${serviceSum}) ≠ Hourly Sum (${hourlySum})`
        );
      }
    }

    return {
      totalCheckins,
      serviceSum,
      hourlySum,
      isConsistent,
      serviceCounts,
      hourlyCounts,
    };
  } catch (error) {
    console.error("❌ Error verifying consistency:", error.message);
    return null;
  }
}

// Run verification
const result = verifyBookingYesterdayConsistency();

if (result) {
  console.log("\n📊 SUMMARY:");
  console.log(`Total Check-ins: ${result.totalCheckins}`);
  console.log(`Service Sum: ${result.serviceSum}`);
  console.log(`Hourly Sum: ${result.hourlySum}`);
  console.log(`Consistent: ${result.isConsistent ? "✅ Yes" : "❌ No"}`);
}
