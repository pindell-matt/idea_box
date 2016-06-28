require 'rails_helper'

RSpec.feature 'current user can change the quality of Ideas' do
  scenario 'by using thumbs up and thumbs down', js: true do
    visit root_path

    wait_for_ajax

    within('#idea-form') do
      fill_in :title, with: "New Idea Title"
      fill_in :body,  with: "New Idea Description"
      click_button "Save"
    end

    within('table tr:nth-child(2)') do
      expect(page).to have_content("New Idea Title")
      expect(page).to have_content("New Idea Description")

      expect(page).to have_content("swill")
    end

    within('table tr:nth-child(2)') do
      click_button "Thumbs Up"
    end

    within('table tr:nth-child(2)') do
      expect(page).to have_content("New Idea Title")
      expect(page).to have_content("New Idea Description")

      expect(page).to_not have_content("swill")
      expect(page).to have_content("plausible")
    end

    within('table tr:nth-child(2)') do
      click_button "Thumbs Up"
    end

    within('table tr:nth-child(2)') do
      expect(page).to have_content("New Idea Title")
      expect(page).to have_content("New Idea Description")

      expect(page).to_not have_content("swill")
      expect(page).to_not have_content("plausible")
      expect(page).to have_content("genius")
    end

    within('table tr:nth-child(2)') do
      click_button "Thumbs Up"
    end

    within('table tr:nth-child(2)') do
      expect(page).to have_content("New Idea Title")
      expect(page).to have_content("New Idea Description")

      expect(page).to_not have_content("swill")
      expect(page).to_not have_content("plausible")
      expect(page).to have_content("genius")
    end

    within('table tr:nth-child(2)') do
      click_button "Thumbs Down"
    end

    within('table tr:nth-child(2)') do
      expect(page).to have_content("New Idea Title")
      expect(page).to have_content("New Idea Description")

      expect(page).to_not have_content("swill")
      expect(page).to have_content("plausible")
      expect(page).to_not have_content("genius")
    end

    within('table tr:nth-child(2)') do
      click_button "Thumbs Down"
    end

    within('table tr:nth-child(2)') do
      expect(page).to have_content("New Idea Title")
      expect(page).to have_content("New Idea Description")

      expect(page).to have_content("swill")
      expect(page).to_not have_content("plausible")
      expect(page).to_not have_content("genius")
    end

    within('table tr:nth-child(2)') do
      click_button "Thumbs Down"
    end

    within('table tr:nth-child(2)') do
      expect(page).to have_content("New Idea Title")
      expect(page).to have_content("New Idea Description")

      expect(page).to have_content("swill")
      expect(page).to_not have_content("plausible")
      expect(page).to_not have_content("genius")
    end

  end
end
