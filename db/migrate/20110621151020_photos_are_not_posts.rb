class PhotosAreNotPosts < ActiveRecord::Migration
  def self.up
    create_table :photos do |t|
      t.integer :author_id
      t.boolean :public
      t.string :guid
      t.boolean :pending
      t.text :text
      t.string :status_message_guid
      t.string :processed_image
      t.string :unprocessed_image
      t.text :remote_photo_path
      t.string :remote_photo_name
      t.string :random_string
      t.timestamps
    end
    execute <<SQL
    INSERT INTO photos
    SELECT posts.id, posts.author_id, posts.public,
      posts.guid, posts.pending, posts.text,
      posts.status_message_guid,
      posts.processed_image, posts.unprocessed_image,
      posts.remote_photo_path, posts.remote_photo_name, posts.random_string,
      posts.created_at, posts.updated_at FROM posts
    WHERE posts.type = "Photo"
SQL
    execute 'DELETE FROM posts WHERE posts.type = "Photo"'

    remove_column :posts, :status_message_guid
    remove_column :posts, :processed_image
    remove_column :posts, :unprocessed_image
    remove_column :posts, :remote_photo_path
    remove_column :posts, :remote_photo_name
  end

  def self.down
  end
end
