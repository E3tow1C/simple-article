import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["preview", "input"]
  static existingImages = []

  connect() {
    if (this.hasInputTarget) {
      this.inputTarget.addEventListener("change", this.handleNewImages.bind(this))
    }
  }

  disconnect() {
    this.constructor.existingImages = []
    console.log("CLEAR!: the existing files: ", this.constructor.existingImages)
  }

  handleNewImages(event) {
    const files = Array.from(event.target.files)
    const previewContainer = this.previewTarget
    const existingPreviews = Array.from(previewContainer.children)
    previewContainer.innerHTML = ""

    files.forEach(file => this.constructor.existingImages.push(file))
    console.log("this is existing files: ", this.constructor.existingImages)


    // Add new files first
    files.forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = () => {
        const preview = this.createPreviewElement(reader.result, index)
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
    console.log("this is files: ", files)
    const dt = new DataTransfer()
    this.constructor.existingImages.forEach(file => dt.items.add(file))

    console.log("this is dt files: ", dt.files)
    this.inputTarget.files = dt.files
  }

  removeNewImage(event) {
    const index = event.currentTarget.dataset.index
    const input = this.inputTarget

    // Remove from FileList
    const dt = new DataTransfer()
    Array.from(input.files)
      .filter((_, i) => i != index)
      .forEach(file => dt.items.add(file))
    input.files = dt.files

    // Remove from existingImages
    this.constructor.existingImages.splice(index, 1)

    // Remove preview
    event.currentTarget.closest('.image-preview-wrapper').remove()
  }

  removeImage(event) {
    const wrapper = event.currentTarget.closest('.image-preview-wrapper')
    wrapper.remove()
  }

  createPreviewElement(src, index) {
    const wrapper = document.createElement('div')
    wrapper.className = 'image-preview-wrapper relative'

    wrapper.innerHTML = `
      <img src="${src}" class="rounded-md w-64 h-64 object-cover">
      <button type="button" 
              data-action="article#removeNewImage" 
              data-index="${index}"
              class="absolute top-1 right-1 text-white text-2xl p-2 cursor-pointer hover:scale-110 transition-all duration-300">
        <i class="fa-solid fa-circle-xmark"></i>
      </button>
    `
    return wrapper
  }
}