require 'rails_helper'

RSpec.feature 'current user can delete Ideas' do
  scenario 'user can delete an existing Idea', js: true do
    3.times do
      Idea.create(
        title: Faker::Hipster.sentence(2),
        body: Faker::Hipster.sentence(4)
      )
    end

    a_idea, b_idea, c_idea = Idea.all

    visit root_path

    wait_for_ajax

    within('table tr:nth-child(2)') do
      expect(page).to have_content(c_idea.title)
      expect(page).to have_content(c_idea.body)
      expect(page).to have_content(c_idea.quality)
    end

    within('table tr:nth-child(3)') do
      expect(page).to have_content(b_idea.title)
      expect(page).to have_content(b_idea.body)
      expect(page).to have_content(b_idea.quality)
    end

    within('table tr:nth-child(4)') do
      expect(page).to have_content(a_idea.title)
      expect(page).to have_content(a_idea.body)
      expect(page).to have_content(a_idea.quality)
    end

    within('table tr:nth-child(3)') do
      click_button "Delete"
    end

    wait_for_ajax

    within('table tr:nth-child(2)') do
      expect(page).to have_content(c_idea.title)
      expect(page).to have_content(c_idea.body)
      expect(page).to have_content(c_idea.quality)
    end

    within('table tr:nth-child(3)') do
      expect(page).to_not have_content(b_idea.title)
      expect(page).to_not have_content(b_idea.body)

      expect(page).to have_content(a_idea.title)
      expect(page).to have_content(a_idea.body)
      expect(page).to have_content(a_idea.quality)
    end

  end

  scenario 'user can delete a new Idea', js: true do
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
      click_button "Delete"
    end

    within('table') do
      expect(page).to_not have_content("New Idea Title")
      expect(page).to_not have_content("New Idea Description")
      expect(page).to_not have_content("swill")
    end

  end
end
