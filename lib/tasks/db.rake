#   Copyright (c) 2010, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

namespace :db do
  desc "rebuild and prepare test db"
  task :rebuild => [:drop, :create, :migrate, 'db:test:prepare']

  namespace :integration do
    # desc 'Check for pending migrations and load the integration schema'
    task :prepare => 'db:abort_if_pending_migrations' do
      #Rake::Task["db:integration:ensure_created"].invoke
      if defined?(ActiveRecord) && !ActiveRecord::Base.configurations.blank?
        Rake::Task[{ :sql  => "db:integration:clone_structure", :ruby => "db:integration:load" }[ActiveRecord::Base.schema_format]].invoke
      end
    end

    task :ensure_created do
      ["integration_1", "integration_2"].each do |env|
        `sh -c "RAILS_ENV=#{env} rake db:create"`
      end
    end

    # desc "Recreate the integration database from the current schema.rb"
    task :load => 'db:integration:purge' do
      ActiveRecord::Base.establish_connection(ActiveRecord::Base.configurations['test'])
      ActiveRecord::Schema.verbose = false
      Rake::Task["db:schema:load"].invoke
    end

    # desc "Recreate the integration databases from the development structure"
    task :clone_structure => [ "db:structure:dump", "db:integration:purge" ] do
      clone_structure_to_env("integration_1")
      clone_structure_to_env("integration_2")
    end

    def clone_structure_to_env(destination_env)
      abcs = ActiveRecord::Base.configurations
      case abcs[destination_env]["adapter"]
      when /mysql/
        ActiveRecord::Base.establish_connection(destination_env.to_sym)
        ActiveRecord::Base.connection.execute('SET foreign_key_checks = 0')
        IO.readlines("#{Rails.root}/db/#{Rails.env}_structure.sql").join.split("\n\n").each do |table|
          ActiveRecord::Base.connection.execute(table)
        end
      when "postgresql"
        ENV['PGHOST']     = abcs[destination_env]["host"] if abcs[destination_env]["host"]
        ENV['PGPORT']     = abcs[destination_env]["port"].to_s if abcs[destination_env]["port"]
        ENV['PGPASSWORD'] = abcs[destination_env]["password"].to_s if abcs[destination_env]["password"]
        `psql -U "#{abcs[destination_env]["username"]}" -f #{Rails.root}/db/#{Rails.env}_structure.sql #{abcs[destination_env]["database"]}`
      when "sqlite", "sqlite3"
        dbfile = abcs[destination_env]["database"] || abcs[destination_env]["dbfile"]
        `#{abcs[destination_env]["adapter"]} #{dbfile} < #{Rails.root}/db/#{Rails.env}_structure.sql`
      when "sqlserver"
        `osql -E -S #{abcs[destination_env]["host"]} -d #{abcs[destination_env]["database"]} -i db\\#{Rails.env}_structure.sql`
      when "oci", "oracle"
        ActiveRecord::Base.establish_connection(destination_env.to_sym)
        IO.readlines("#{Rails.root}/db/#{Rails.env}_structure.sql").join.split(";\n\n").each do |ddl|
          ActiveRecord::Base.connection.execute(ddl)
        end
      when "firebird"
        set_firebird_env(abcs[destination_env])
        db_string = firebird_db_string(abcs[destination_env])
        sh "isql -i #{Rails.root}/db/#{Rails.env}_structure.sql #{db_string}"
      else
        raise "Task not supported by '#{abcs[destination_env]["adapter"]}'"
      end
    end

    # desc "Empty the integration databases"
    task :purge => :environment do
      purge_env("integration_1")
      purge_env("integration_2")
    end
    def purge_env(desired_env)
    abcs = ActiveRecord::Base.configurations
    case abcs[desired_env]["adapter"]
    when /mysql/
      ActiveRecord::Base.establish_connection(desired_env.to_sym)
      ActiveRecord::Base.connection.recreate_database(abcs[desired_env]["database"], abcs[desired_env])
    when "postgresql"
      ActiveRecord::Base.clear_active_connections!
      drop_database(abcs[desired_env])
      create_database(abcs[desired_env])
    when "sqlite","sqlite3"
      dbfile = abcs[desired_env]["database"] || abcs[desired_env]["dbfile"]
      File.delete(dbfile) if File.exist?(dbfile)
    when "sqlserver"
      dropfkscript = "#{abcs[desired_env]["host"]}.#{abcs[desired_env]["database"]}.DP1".gsub(/\\/,'-')
      `osql -E -S #{abcs[desired_env]["host"]} -d #{abcs[desired_env]["database"]} -i db\\#{dropfkscript}`
      `osql -E -S #{abcs[desired_env]["host"]} -d #{abcs[desired_env]["database"]} -i db\\#{Rails.env}_structure.sql`
    when "oci", "oracle"
      ActiveRecord::Base.establish_connection(desired_env.to_sym)
      ActiveRecord::Base.connection.structure_drop.split(";\n\n").each do |ddl|
        ActiveRecord::Base.connection.execute(ddl)
      end
    when "firebird"
      ActiveRecord::Base.establish_connection(desired_env.to_sym)
      ActiveRecord::Base.connection.recreate_database!
    else
      raise "Task not supported by '#{abcs[desired_env]["adapter"]}'"
    end
    end
  end

  desc 'Seed the current RAILS_ENV database from db/seeds.rb'
  namespace :seed do
    task :tom do
      puts "Seeding the database for #{Rails.env}..."
      require File.dirname(__FILE__) + '/../../db/seeds/tom'
    end

    task :dev do
      puts "Seeding the database for #{Rails.env}..."
      require File.dirname(__FILE__) + '/../../db/seeds/dev'
    end

    task :backer do
      puts "Seeding the database for #{Rails.env}..."
      require File.dirname(__FILE__) + '/../../db/seeds/backer'
      create
    end

    task :first_user, :username, :password, :email do |t, args|
      puts "Setting up first user in #{Rails.env} database"
      ARGS = args
      require File.dirname(__FILE__) + '/../../db/seeds/add_user'
    end

  end

  desc 'Delete the collections in the current RAILS_ENV database'
  task :purge do
    require File.join(File.dirname(__FILE__), '..', '..', 'config', 'environment')

    puts "Purging the database for #{Rails.env}..."

    Rake::Task['db:rebuild'].invoke

   puts 'Deleting tmp folder...'
   `rm -rf #{File.dirname(__FILE__)}/../../public/uploads/*`
  end

  desc 'Purge and seed the current RAILS_ENV database using information from db/seeds.rb'
  task :reset do
    puts "Resetting the database for #{Rails.env}".upcase
    Rake::Task['db:purge'].invoke
    Rake::Task['db:seed'].invoke
    puts "Success!"
  end

  desc "Purge database and then add the first user"
  task :first_user, :username, :password, :email do |t, args|
    Rake::Task['db:purge'].invoke
    Rake::Task['db:seed:first_user'].invoke(args[:username], args[:password], args[:email])
  end
  task :first_user => :environment

  desc "Add a new user to the database"
  task :add_user, :username, :password do |t, args|
    ARGS = args
    require File.dirname(__FILE__) + '/../../db/seeds/add_user'
  end
  task :add_user => :environment

  task :fix_diaspora_handle do
    puts "fixing the people in this seed"
    require File.join(File.dirname(__FILE__), '..', '..', 'config', 'environment')
    Person.where(:url => 'example.org').all.each{|person|
      if person.owner
        person.url = AppConfig[:pod_url]
        person.diaspora_handle = person.owner.diaspora_handle
        person.save
      end
    }
    puts "everything should be peachy"
  end

  task :move_private_key do
    require File.join(File.dirname(__FILE__), '..', '..', 'config', 'environment')
    User.all.each do |user|
      if user.serialized_private_key.nil?
        user.serialized_private_key = user.person.serialized_key
        user.save
        person = user.person
        person.serialized_key = nil
        person.serialized_public_key = user.encryption_key.public_key.to_s
        person.save
      end
    end
  end
end
