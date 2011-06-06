class MergeProfileIntoPerson < ActiveRecord::Migration
  def self.columns
    @columns ||= [
      { :type => :string,   :name => :first_name, :opts => { :limit => 127 } },
      { :type => :string,   :name => :last_name, :opts => { :limit => 127 } },
      { :type => :string,   :name => :image_url },
      { :type => :string,   :name => :image_url_small },
      { :type => :string,   :name => :image_url_medium },
      { :type => :date,     :name => :birthday },
      { :type => :string,   :name => :gender },
      { :type => :text,     :name => :bio },
      { :type => :boolean,  :name => :searchable, :opts => { :default => true, :null => false } },
      { :type => :string,   :name => :location }
    ]
  end

  def self.up
    columns.each do |col|
      if col[:opts]
        add_column :people, col[:name], col[:type], col[:opts]
      else
        add_column :people, col[:name], col[:type]
      end
    end

    set_string = columns.map { |col| "people.#{col[:name]} = profiles.#{col[:name]}" }.join(',')

    execute <<SQL
    UPDATE people INNER JOIN profiles ON profiles.person_id = people.id
    SET #{set_string}
SQL

    columns.each do |col|
      remove_column :profiles, col[:name]
    end
  end

  def self.down
    columns.each do |col|
      if col[:opts]
        add_column :profiles, col[:name], col[:type], col[:opts]
      else
        add_column :profiles, col[:name], col[:type]
      end
    end
    set_string = columns.map { |col| "profiles.#{col[:name]} = people.#{col[:name]}" }.join(', ')

    execute <<SQL
    UPDATE profiles INNER JOIN people ON profiles.person_id = people.id
    SET #{set_string}
SQL

    columns.each do |col|
      remove_column :people, col[:name]
    end
  end
end
