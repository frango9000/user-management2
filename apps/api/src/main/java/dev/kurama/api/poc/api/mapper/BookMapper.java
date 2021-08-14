package dev.kurama.api.poc.api.mapper;

import dev.kurama.api.poc.api.domain.input.BookInput;
import dev.kurama.api.poc.api.domain.model.BookModel;
import dev.kurama.api.poc.domain.Book;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper()
public interface BookMapper {

  @Mapping(target = "authorId", source = "author.id")
  BookModel bookToBookModel(Book book);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "tid", ignore = true)
  @Mapping(target = "author", ignore = true)
  Book bookInputToBook(BookInput bookInput);

  List<BookModel> booksToBookModels(List<Book> books);
}