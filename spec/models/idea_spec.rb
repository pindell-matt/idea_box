require 'rails_helper'

describe Idea do
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:body) }
  it { should define_enum_for(:quality).with([:swill, :plausible, :genius]) }
end
