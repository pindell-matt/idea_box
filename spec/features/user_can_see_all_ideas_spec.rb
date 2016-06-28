require 'rails_helper'

RSpec.feature 'current user can see all existing Ideas' do
  scenario 'on the root path, when ideas exist in the database', js: true do
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

  end
end
