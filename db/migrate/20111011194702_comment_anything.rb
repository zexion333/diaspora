class CommentAnything < ActiveRecord::Migration
  def self.up
    # before renaming the post_id column, we have to remove the corresponding indices and foreign keys
    remove_foreign_key :comments, :posts
    remove_index :comments, :post_id

    # make comments able to refer to any table
    # so the name post_id does not make sense anymore, since we could also refer to a different table
    # call it commentable_id as a generic reference to a foreign key
    # store the table that commentable_id refers to in commentable_type
    change_table :comments do |t|
      t.rename :post_id, :commentable_id
      t.string :commentable_type, :default => 'Post', :null => false
    end
    
    # NOTE: the stupid author of this migration forgot to reestablish the indices and keys
  end

  def self.down
    # rename the commentable_id back to post_id
    # NOTE perhaps this might be an issue if there are duplicated commentable_id
    # refering to different commentable_type (tables)
    rename_column :comments, :commentable_id, :post_id

    # reestablish keys and indices
    add_foreign_key :comments, :posts, :dependent => :delete
    add_index :comments, :post_id

    # remove type column because comments can now only refer to Posts again
    remove_column :comments, :commentable_type
  end
end
