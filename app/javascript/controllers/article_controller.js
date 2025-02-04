import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="article"
export default class extends Controller {
  connect() {
    console.log("Hello, Stimulus! this is article_controller.js")
  }
}
