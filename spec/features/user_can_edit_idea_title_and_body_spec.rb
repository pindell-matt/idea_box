require 'rails_helper'

RSpec.feature 'current user can edit the title or body of a new Idea' do
  scenario 'by clicking on the current text', js: true do

    visit root_path

    wait_for_ajax

    within('#idea-form') do
      fill_in :title, with: "Un-Edited Title"
      fill_in :body,  with: "Please Edit me!"
      click_button "Save"
    end

    within('table tr:nth-child(2)') do
      expect(page).to have_content("Un-Edited Title")
      expect(page).to have_content("Please Edit me!")
    end

    within('table tr:nth-child(2)') do
      title = find('.title')
      title.set('Edited Title')
    end

    within('#idea-form') do
      click_on "Save"
    end

    within('table tr:nth-child(2)') do
      expect(page).to have_content("Edited Title")
      expect(page).to_not have_content("Un-Edited Title")
      expect(page).to have_content("Please Edit me!")
    end

    within('table tr:nth-child(2)') do
      body = find('.body')
      body.set("I've been Edited!")
    end

    within('table tr:nth-child(2)') do
      expect(page).to have_content("Edited Title")
      expect(page).to have_content("I've been Edited!")
      expect(page).to_not have_content("Un-Edited Title")
      expect(page).to_not have_content("Please Edit me!")
    end

  end
end
