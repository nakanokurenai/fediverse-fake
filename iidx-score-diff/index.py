import csv
import json

class Score:
  def __init__(self, t):
    self.difficulty, self.ex_score, self.pgreat, self.great, self.miss_count, self.clear_type, self.dj_level = t

  def to_dict(self):
    return {
      'difficulty': self.difficulty,
      'ex_score': self.ex_score,
      'pgreat': self.pgreat,
      'miss_count': self.miss_count,
      'clear_type': self.clear_type,
      'dj_level': self.dj_level
    }

class Song:
  def __init__(self, row, beginner_score=None, normal_score=None, hyper_score=None, another_score=None, leggendaria_score=None):
    self.series, self.name, self.genre, self.artist, self.select_count = row[:5]
    self.updated_at = row[-1]
    self.beginner_score = beginner_score
    self.normal_score = normal_score
    self.hyper_score = hyper_score
    self.another_score = another_score
    self.leggendaria_score = leggendaria_score

  @classmethod
  def import_rootage_row(cls, row):
    scores = [None]
    score = row[5:len(row)-1] # 0-indexed
    while len(score) > 0:
      scores.append(Score(score[:7]))
      score = score[7:]
    scores.append(None)
    return cls(row, *scores)

  @classmethod
  def import_heroic_verse_row(cls, row):
    scores = []
    score = row[5:len(row)-1] # 0-indexed
    while len(score) > 0:
      scores.append(Score(score[:7]))
      score = score[7:]
    return cls(row, *scores)

  def to_dict(self):
    return {
      'series': self.series,
      'name': self.name,
      'genre': self.genre,
      'artist': self.artist,
      'select_count': self.select_count,
      'updated_at': self.updated_at,
      'beginner_score': self.beginner_score.to_dict() if self.beginner_score is not None else None,
      'normal_score': self.normal_score.to_dict() if self.normal_score is not None else None,
      'hyper_score': self.hyper_score.to_dict() if self.hyper_score is not None else None,
      'another_score': self.another_score.to_dict() if self.another_score is not None else None,
      'leggendaria_score': self.leggendaria_score.to_dict() if self.leggendaria_score is not None else None,
    }

rootage_songs = {}
heroic_verse_songs = {}

with open('/home/owner/Downloads/iidx-score-data/26-final-1357-7087_sp_score.csv') as score26csv:
  readee = csv.reader(score26csv)
  readee.__next__()
  for row in readee:
    song = Song.import_rootage_row(row)
    rootage_songs[song.series + song.name + song.artist] = song

with open('/home/owner/Downloads/iidx-score-data/27-20191130-1357-7087_sp_score.csv') as score26csv:
  readee = csv.reader(score26csv)
  readee.__next__()
  for row in readee:
    song = Song.import_heroic_verse_row(row)
    heroic_verse_songs[song.series + song.name + song.artist] = song

for key, rootage_song in rootage_songs.items():
  hv_song = heroic_verse_songs.get(key)
  if hv_song is None:
    continue
  if rootage_song.another_score.clear_type != hv_song.another_score.clear_type:
    print('[{} {}]\n\t->\t{:+}\t{}\t{}'.format(
      rootage_song.another_score.difficulty,
      rootage_song.name,
      int(hv_song.another_score.ex_score) - int(rootage_song.another_score.ex_score),
      hv_song.another_score.dj_level if rootage_song.another_score.dj_level != hv_song.another_score.dj_level else '---',
      "{} -> {}".format(rootage_song.another_score.clear_type, hv_song.another_score.clear_type) if rootage_song.another_score.clear_type != hv_song.another_score.clear_type else '---',
    ))
    # print('[★{} {}]\n\t{}\t{}\t({}) ->\n\t{}\t{}\t({})\n\t{:+}\t{}\t({})'.format(
    #   rootage_song.another_score.difficulty,
    #   rootage_song.name,
    #   rootage_song.another_score.ex_score,
    #   rootage_song.another_score.dj_level,
    #   rootage_song.another_score.clear_type,
    #   hv_song.another_score.ex_score,
    #   hv_song.another_score.dj_level,
    #   hv_song.another_score.clear_type,
    #   int(hv_song.another_score.ex_score) - int(rootage_song.another_score.ex_score),
    #   hv_song.another_score.dj_level if rootage_song.another_score.dj_level != hv_song.another_score.dj_level else '---',
    #   hv_song.another_score.clear_type if rootage_song.another_score.clear_type != hv_song.another_score.clear_type else '---',
    # ))
