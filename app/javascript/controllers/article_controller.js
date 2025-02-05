import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["preview", "input", "topic", "body", "submit", "bottomSheet", "overlay"]
  static existingImages = []
  static values = {
    hasErrors: Boolean,
  }

  connect() {
    this.overlayTarget.addEventListener("click", this.toggleBottomSheet.bind(this))

    console.log("Article is erorrs: ", this.hasErrorsValue)
    if (this.hasInputTarget) {
      this.inputTarget.addEventListener("change", this.handleNewImages.bind(this))
    }

    if (!this.hasErrorsValue) {
      this.constructor.existingImages = []
      return
    }

    if (this.constructor.existingImages.length === 0) {
      return
    }

    this.recreatePreviewsFromExistingImages()
    console.log("recreate previews from existing images")
  }

  recreatePreviewsFromExistingImages() {
    this.constructor.existingImages.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const preview = this.createPreviewElement(reader.result, file.name)
        this.previewTarget.appendChild(preview)
      }
      reader.readAsDataURL(file)
    })

    // Update the input's FileList to include existing files
    const dt = new DataTransfer()
    this.constructor.existingImages.forEach(file => dt.items.add(file))
    this.inputTarget.files = dt.files

  }

  handleSubmitSuccess() {
    this.constructor.existingImages = []
    console.log("CLEAR!: the existing files: ", this.constructor.existingImages)
  }

  handleNewImages(event) {
    const files = Array.from(event.target.files)
    const previewContainer = this.previewTarget
    const existingPreviews = Array.from(previewContainer.children)

    if (files.length === 0) {
      // Update the input's FileList to include existing files when no new files are selected
      const dt = new DataTransfer()
      this.constructor.existingImages.forEach(file => dt.items.add(file))
      this.inputTarget.files = dt.files
      return
    }

    // Filter out files that already exist in existingImages
    const newFiles = files.filter(file =>
      !this.constructor.existingImages.some(existing => existing.name === file.name)
    );

    // If all files were duplicates, keep existing files and return
    if (newFiles.length === 0) {
      const dt = new DataTransfer()
      this.constructor.existingImages.forEach(file => dt.items.add(file))
      this.inputTarget.files = dt.files
      return
    }

    // Update files array to only include unique files
    files.length = 0;
    files.push(...newFiles)

    previewContainer.innerHTML = ""

    files.forEach(file => this.constructor.existingImages.push(file))
    console.log("this is existing files: ", this.constructor.existingImages)

    // Add new files first
    files.forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = () => {
        const preview = this.createPreviewElement(reader.result, file.name)
        previewContainer.appendChild(preview)

        // After adding new file preview, append existing previews
        if (index === files.length - 1) {
          existingPreviews.forEach(preview => {
            previewContainer.appendChild(preview)
          })
        }
      }
      reader.readAsDataURL(file)
    })

    // Update the input's FileList to include both new and existing files
    const dt = new DataTransfer()
    this.constructor.existingImages.forEach(file => dt.items.add(file))
    this.inputTarget.files = dt.files
  }

  removeFileFromInput(filename) {
    console.log("remove file from input: ", filename)
    const dt = new DataTransfer()
    Array.from(this.inputTarget.files)
      .filter(file => file.name !== filename)
      .forEach(file => dt.items.add(file))
    this.inputTarget.files = dt.files
  }

  removeNewImage(event) {
    const filename = event.currentTarget.dataset.filename
    console.log("remove new image: ", filename)

    this.removeFileFromInput(filename)

    // Remove from existingImages
    const index = this.constructor.existingImages.findIndex(file => file.name === filename)

    if (index !== -1) {
      this.constructor.existingImages.splice(index, 1)
    }

    // Remove preview
    event.currentTarget.closest('.image-preview-wrapper').remove()
  }

  createPreviewElement(src, filename) {
    const wrapper = document.createElement('div')
    wrapper.className = 'image-preview-wrapper relative mt-4'

    wrapper.innerHTML = `
      <img src="${src}" class="rounded-md w-64 h-64 object-cover">
      <button type="button" 
              data-action="article#removeNewImage" 
              data-filename="${filename}"
              class="z-10 absolute -top-1 right-0 text-red-400 text-2xl p-1 cursor-pointer hover:scale-110 transition-all duration-300">
        <i class="fa-regular fa-circle-xmark items-center"></i>
      </button>
      <div class="absolute top-0 right-0 bg-white opacity-90 p-4 rounded-bl-md rounded-tr-md"></div>
    `
    return wrapper
  }

  toggleBottomSheet() {
    // Only close if clicking overlay directly, not bottomsheet
    if (event && event.target.closest('[data-article-target="bottomSheet"]')) {
      return
    }

    this.bottomSheetTarget.classList.toggle("translate-y-full")
    this.overlayTarget.classList.toggle("opacity-0")
    this.overlayTarget.classList.toggle("pointer-events-none")
  }
}