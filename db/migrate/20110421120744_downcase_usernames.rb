class DowncaseUsernames < ActiveRecord::Migration
  def self.up
    execute <<SQL
      UPDATE users
      SET username = LOWER(username)
      WHERE username != LOWER(username)
SQL
  end

  def self.down
    raise ActiveRecord::IrreversibleMigration.new
  end
end
