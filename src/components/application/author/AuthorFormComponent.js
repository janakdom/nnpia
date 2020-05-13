import * as React from 'react';
import '../../../styles/quotes.css';
import ApplicationLayout from "./../layout/ApplicationLayout";
import PopupMessagesService from "../../../service/PopupMessagesService";
import AuthorService from "../../../service/AuthorService";
import CategoryService from "../../../service/CategoryService";
import CreatableSelect from 'react-select/creatable';
import {withRouter} from 'react-router-dom';
import {Link} from "react-router-dom";
import QuoteService from "../../../service/QuoteService";

class AuthorFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorId: props.match.params.id,
      firstname: "",
      surname: "",
      country: ""
    }

    this.handleAddMore = this.handleAddMore.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount() {
    document.title = (this.props.action === "new" ? "Nový autor" : "Upravit autora") + " | Citáty";
    if(this.props.action === "edit"){
      this.loadAuthorData();
    }
  }

  loadAuthorData(){
    AuthorService.get(this.state.authorId).then((res)=>{
      if(res.data.status === 200) {
        if(res.data.status_key === "SUCCESS"){
          this.setState({
            firstname: res.data.result.firstname,
            surname: res.data.result.surname,
            country: res.data.result.country
          })
        }else if(res.data.status_key === "NOT-EXISTS"){
          PopupMessagesService.error("Požadovaný autor neexistuje!");
        }
      } else {
        PopupMessagesService.error("Nepodařilo se načíst data o autorovi!");
      }
    });
  }

  render() {
        return (
          <ApplicationLayout pageTitle={this.props.pageTitle}>
            <form>
              <div className="d-flex mb-3">
                <Link className="btn btn-outline-danger px-4" to="/app"><i className="fas fa-arrow-left"/> Přejít na výpis</Link>
                <div className="btn-group ml-auto">
                {
                  this.props.action === "new" ?
                  (
                    <React.Fragment>
                        <span className="btn btn-outline-success px-4" onClick={this.handleAddMore}><i className="fas fa-plus"/> Přidat více</span>
                        <span className="btn btn-success px-4" onClick={this.handleAdd}><i className="fas fa-save"/> Přidat</span>
                    </React.Fragment>
                  ):(
                      <span className="btn btn-warning px-4" onClick={this.handleSaveChanges}><i className="fas fa-save"/> Uložit změny</span>
                  )
                }
                  </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-5">
                  <label htmlFor="inputCity">Jméno</label>
                  <input type="text" class="form-control" name="firstname" onChange={this.onChange} value={this.state.firstname} />
                </div>
                <div className="form-group col-md-5">
                  <label htmlFor="inputCity">Příjmení</label>
                  <input type="text" className="form-control" name="surname" onChange={this.onChange} value={this.state.surname}/>
                </div>
                <div className="form-group col-md-2">
                  <label htmlFor="inputCity">Stát</label>
                  <input type="text" className="form-control" name="country" onChange={this.onChange} value={this.state.country}/>
                </div>
              </div>
            </form>
          </ApplicationLayout>
        );
  }

  handleSaveChanges = e => {
    if(!this.validateQuotesData()) return;

    AuthorService.update(this.state.authorId, this.state.firstname.trim(), this.state.surname.trim(), this.state.country.trim()).then((res) => {
      console.log(res.data);
      if(res.data.status === 200) {
        if(res.data.status_key === "SUCCESS"){
          this.props.history.push("/app/author");
        }
        else{
          PopupMessagesService.warn("Tento citát již v databázi je, prosím vložte jiný.");
        }
      }
      else{
        PopupMessagesService.error("Při vkládání citátu nastala neočekávaná chyba!");
      }
    });
  }

  validateQuotesData(){
    if(this.state.firstname.length <= 0){
      PopupMessagesService.warn("Zadejte jméno autora!");
      return false;
    }

    if(this.state.surname.length <= 0){
      PopupMessagesService.warn("Zadejte příjmení autora!");
      return false;
    }

    if(this.state.country.length <= 0 || this.state.country.length > 3){
      PopupMessagesService.warn("Zadejte třípísmennout zkratku státu!");
      return false;
    }

    return true;
  }

  addAuthor(redirect){
    if(!this.validateQuotesData()) return;

    AuthorService.add(this.state.firstname.trim(), this.state.surname.trim(), this.state.country.trim()).then((res) => {
      let clear = true;
      if(res.data.status === 200) {
        console.log(res.data);
        if(res.data.status_key === "SUCCESS"){
          PopupMessagesService.success("Autor přidán byl uložen.");
        }
        else{
          PopupMessagesService.warn("Tento autor již v databázi je, prosím vložte jiného.");
          clear = false;
        }
      }
      else{
        PopupMessagesService.error("Při ukládání autora nastala neočekávaná chyba!");
        clear = false;
      }

      if(redirect){
        this.props.history.push("/app/author");
      }

      if(clear){
        this.setState({firstname: "", surname: "", country: ""});
      }
    });
  }

  handleAddMore(){
    this.addAuthor(false);
  }

  handleAdd(){
    this.addAuthor(true);
  }

  onChange = (e) =>{
    this.setState({[e.target.name]: e.target.value });
  }
}

export default withRouter(AuthorFormComponent);