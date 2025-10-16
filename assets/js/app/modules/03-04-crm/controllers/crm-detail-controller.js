(function (global) {
  const App = global.App || {};
  const domain = (App.utils && App.utils.domain) || {};

  const getLocationName =
    domain.getLocationName || ((locationId) => locationId || "all");
  const getDepartmentName =
    domain.getDepartmentName || ((departmentId) => departmentId || "all");

  function updateMemberMovementPage(data, filters) {
    console.log("Updating member movement page with filters:", filters);

    const headerTitle = document.querySelector(".card-title");
    if (headerTitle) {
      const locationName = getLocationName(filters.location);
      const departmentName = getDepartmentName(filters.department);
      headerTitle.innerHTML = `
        <i class="fas fa-exchange-alt me-2"></i>
        Chi tiet Member Movement - ${locationName}
        ${filters.department !== "all" ? ` | ${departmentName}` : ""}
      `;
    }

    const newJoinersValue = document.querySelector("#countValue, #metricValue");
    if (newJoinersValue && data?.memberMovement?.newJoiners) {
      newJoinersValue.textContent = data.memberMovement.newJoiners;
    }
  }

  const handlers = {
    "member-movement": updateMemberMovementPage,
  };

  App.modules = App.modules || {};
  App.modules.register?.("03-04-crm", {
    name: "CRM Management",
    pages: [{ code: "03-04-04", patterns: ["member-movement"] }],
    handlers,
  });

  global.App.controllers = global.App.controllers || {};
  global.App.controllers.crmDetails = {
    updateMemberMovementPage,
  };
})(window);
