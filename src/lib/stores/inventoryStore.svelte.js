import { invalidateAll } from "$app/navigation";

class InventoryStore {
  selectedGardenId = $state("");
  isModalOpen = $state(false);
  modalMode = $state("create");
  selectedItem = $state(null);
  errors = $state({});
  showToast = $state(false);
  toastMessage = $state({ title: "", message: "" });
  formData = $state({
    name: "",
    type: "plant",
    quantity: 1,
    quantityType: "",
    isImportant: false,
    desiredQuantity: 0,
  });

  constructor() {}

  resetForm() {
    this.formData = {
      name: "",
      type: "plant",
      quantity: 1,
      quantityType: "",
      isImportant: false,
      desiredQuantity: 0,
    };
    this.selectedItem = null;
    this.errors = {};
  }

  openCreateModal = () => {
    this.resetForm();
    this.modalMode = "create";
    this.isModalOpen = true;
  };

  openEditModal = (item) => {
    this.selectedItem = item;
    this.formData = {
      name: item.name,
      type: item.type,
      quantity: item.quantity,
      quantityType: item.quantityType || "",
      isImportant: item.isImportant || false,
      desiredQuantity: item.desiredQuantity || 0,
    };
    this.errors = {};
    this.modalMode = "edit";
    this.isModalOpen = true;
  };

  openDeleteModal = (item) => {
    this.selectedItem = item;
    this.modalMode = "delete";
    this.isModalOpen = true;
  };

  closeModal = () => {
    this.isModalOpen = false;
    this.errors = {};
  };

  displayToast = (title, message) => {
    this.toastMessage = { title, message };
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  };

  validateForm(inventory) {
    const newErrors = {};
    let isValid = true;

    const duplicate = inventory.find(
      (item) =>
        item.name.toLowerCase() === this.formData.name.trim().toLowerCase() &&
        // @ts-ignore
        (this.modalMode === "create" || item._id !== this.selectedItem._id),
    );

    if (!this.formData.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    } else if (duplicate) {
      newErrors.name = "An item with this name already exists.";
      isValid = false;
    }

    if (
      this.formData.quantity === null ||
      // @ts-ignore
      this.formData.quantity === "" ||
      this.formData.quantity < 0
    ) {
      newErrors.quantity = "Quantity must be 0 or higher.";
      isValid = false;
    }

    if (this.formData.isImportant) {
      if (
        this.formData.desiredQuantity === null ||
        // @ts-ignore
        this.formData.desiredQuantity === "" ||
        this.formData.desiredQuantity < 0
      ) {
        newErrors.desiredQuantity = "Required when marked important.";
        isValid = false;
      }
    }

    this.errors = newErrors;
    return isValid;
  }

  handleSubmit = async (inventory) => {
    if (this.modalMode !== "delete" && !this.validateForm(inventory)) {
      return;
    }

    const baseUrl = "http://localhost:3030/inventory/";

    const payload = {
      ...this.formData,
      gardenId: this.selectedGardenId,
    };

    try {
      let response;
      if (this.modalMode === "create") {
        response = await fetch(baseUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (this.modalMode === "edit") {
        // @ts-ignore
        response = await fetch(`${baseUrl}${this.selectedItem._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.formData),
        });
      } else if (this.modalMode === "delete") {
        // @ts-ignore
        response = await fetch(`${baseUrl}${this.selectedItem._id}`, {
          method: "DELETE",
        });
      }

      // @ts-ignore
      if (response.ok) {
        this.closeModal();
        await invalidateAll();

        // Show success toast
        if (this.modalMode === "create") {
          this.displayToast(
            "Item added successfully",
            `${this.formData.name} has been added to your inventory`,
          );
        }
      }
    } catch (error) {
      console.error("Network Error", error);
    }
  };
}

export const inventoryStore = new InventoryStore();
