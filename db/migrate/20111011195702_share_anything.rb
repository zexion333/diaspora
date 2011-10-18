class ShareAnything < ActiveRecord::Migration
  def self.up
    # remove indices and keys of post_id column, since we want to rename it
    remove_foreign_key :aspect_visibilities, :posts
    remove_index :aspect_visibilities, :post_id_and_aspect_id
    remove_index :aspect_visibilities, :post_id

    # rename post_id column to shareable_id since now everything can have
    # a aspect_visibility not only posts
    # store the table that the thing we reference in shareable_id in shareable_type
    change_table :aspect_visibilities do |t|
      t.rename :post_id, :shareable_id
      t.string :shareable_type, :default => 'Post', :null => false
    end

    # reestablish keys
    # NOTE we cannot reestablish the foreign key, since not all shareable_ids refer to post_ids
    add_index :aspect_visibilities, [:shareable_id, :shareable_type, :aspect_id], :name => 'shareable_and_aspect_id'
    add_index :aspect_visibilities, [:shareable_id, :shareable_type]

    
    # the following code is the same as the above
    # only for the post_visibilities table (which is renamed to shareable_type)
    remove_foreign_key :post_visibilities, :posts
    remove_index :post_visibilities, :contact_id_and_post_id
    remove_index :post_visibilities, :post_id_and_hidden_and_contact_id

    change_table :post_visibilities do |t|
      t.rename :post_id, :shareable_id
      t.string :shareable_type, :default => 'Post', :null => false
    end

    rename_table :post_visibilities, :share_visibilities
    add_index :share_visibilities, [:shareable_id, :shareable_type, :contact_id], :name => 'shareable_and_contact_id'
    add_index :share_visibilities, [:shareable_id, :shareable_type, :hidden, :contact_id], :name => 'shareable_and_hidden_and_contact_id'
  end


  def self.down
    # remove indices and keys of shareable_id column, since we want to rename it
    remove_index :share_visibilities, :name => 'shareable_and_hidden_and_contact_id'
    remove_index :share_visibilities, :name => 'shareable_and_contact_id'

    # rename share_visibilities back to post_visibilities
    rename_table :share_visibilities, :post_visibilities 

    # rename shareable_id back to post_id and remove shareable_type since
    # we now can only reference posts again
    change_table :post_visibilities do |t|
      t.remove :shareable_type
      t.rename :shareable_id, :post_id
    end

    # reestablish indices and foreign key
    add_index :post_visibilities, [:post_id, :hidden, :contact_id], :unique => true
    add_index :post_visibilities, [:contact_id, :post_id], :unique => true
    add_foreign_key :post_visibilities, :posts, :dependent => :delete


    # same as above but not for post_visibilities but for aspect_visibilities
    remove_index :aspect_visibilities, [:shareable_id, :shareable_type]
    remove_index :aspect_visibilities, :name => 'shareable_and_aspect_id'

    change_table :aspect_visibilities do |t|
      t.remove :shareable_type
      t.rename :shareable_id, :post_id
    end

    add_index :aspect_visibilities, :post_id, :dependent => :delete
    add_index :aspect_visibilities, [:post_id, :aspect_id], :unique => true
    add_foreign_key :aspect_visibilities, :posts, :dependent => :delete
  end
end
